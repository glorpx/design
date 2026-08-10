import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tag } from '../../src/components/core/Tag';

describe('Tag', () => {
  it('renders children content', () => {
    render(<Tag>My Tag</Tag>);
    expect(screen.getByText('My Tag')).toBeInTheDocument();
  });

  it('renders without remove button when onRemove is not provided', () => {
    render(<Tag>My Tag</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders remove button when onRemove callback is provided', () => {
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>My Tag</Tag>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('gx-tag__x');
  });

  it('calls onRemove callback when remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>My Tag</Tag>);
    const button = screen.getByRole('button');
    button.click();
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('has proper aria-label for remove button with text children', () => {
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove} removeLabel="Delete">My Tag</Tag>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Delete: My Tag');
  });

  it('uses default removeLabel "Remove" when not provided', () => {
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>My Tag</Tag>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Remove: My Tag');
  });

  it('renders accessibility marker with aria-hidden', () => {
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>My Tag</Tag>);
    const hiddenSpan = screen.getByText('×');
    expect(hiddenSpan).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom className when provided', () => {
    render(<Tag className="custom-tag">My Tag</Tag>);
    const tagElement = screen.getByText('My Tag').closest('span');
    expect(tagElement).toHaveClass('custom-tag');
  });

  it('applies custom style overrides', () => {
    render(<Tag style={{ padding: '10px 20px' }}>My Tag</Tag>);
    const tagElement = screen.getByText('My Tag').closest('span');
    expect(tagElement).toHaveStyle({ padding: '10px 20px' });
  });

  it('uses design token CSS variables for styling', () => {
    render(<Tag>My Tag</Tag>);
    const tagElement = screen.getByText('My Tag').closest('span');
    expect(tagElement).toHaveStyle({
      display: 'inline-flex',
      background: 'var(--gx-surface-raised)',
      color: 'var(--gx-text)',
      border: '1px solid var(--gx-hairline)',
    });
  });

  it('has correct inline-flex layout with gap', () => {
    render(<Tag>My Tag</Tag>);
    const tagElement = screen.getByText('My Tag').closest('span');
    expect(tagElement).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    });
  });

  it('remove button has correct type and styling', () => {
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>My Tag</Tag>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveStyle({
      cursor: 'pointer',
      display: 'grid',
    });
  });

  it('supports forward additional HTML attributes', () => {
    render(<Tag data-testid="custom-tag">My Tag</Tag>);
    expect(screen.getByTestId('custom-tag')).toBeInTheDocument();
  });
});
