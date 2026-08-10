import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from '../../src/components/core/Avatar';

describe('Avatar', () => {
  it('renders with image when src is provided', () => {
    render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" />);
    const img = screen.getByRole('img', { name: 'John Doe' });
    expect(img).toBeInTheDocument();
    const innerImg = img.querySelector('img');
    expect(innerImg).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('falls back to initials when src is not provided', () => {
    render(<Avatar name="John Doe" />);
    const img = screen.getByRole('img', { name: 'John Doe' });
    expect(img).toHaveTextContent('JD');
  });

  it('generates initials from first two words', () => {
    render(<Avatar name="Alice Bob Charlie" />);
    const img = screen.getByRole('img', { name: 'Alice Bob Charlie' });
    expect(img).toHaveTextContent('AB');
  });

  it('handles single word names', () => {
    render(<Avatar name="Alice" />);
    const img = screen.getByRole('img', { name: 'Alice' });
    expect(img).toHaveTextContent('A');
  });
  it('handles empty initials for name with no words', () => {
    render(<Avatar name="   " />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('aria-label', '   ');
    expect(img).toHaveTextContent('');
  });

  it('renders with size sm (24px)', () => {
    render(<Avatar name="John Doe" size="sm" />);
    const img = screen.getByRole('img', { name: 'John Doe' });
    expect(img).toHaveStyle({ inlineSize: '24px', blockSize: '24px' });
  });

  it('renders with size md (32px) by default', () => {
    render(<Avatar name="John Doe" />);
    const img = screen.getByRole('img', { name: 'John Doe' });
    expect(img).toHaveStyle({ inlineSize: '32px', blockSize: '32px' });
  });

  it('renders with size lg (48px)', () => {
    render(<Avatar name="John Doe" size="lg" />);
    const img = screen.getByRole('img', { name: 'John Doe' });
    expect(img).toHaveStyle({ inlineSize: '48px', blockSize: '48px' });
  });
  it('has correct aria-label and role attributes', () => {
    render(<Avatar name="John Doe" />);
    const img = screen.getByRole('img', { name: 'John Doe' });
    expect(img).toHaveAttribute('role', 'img');
    expect(img).toHaveAttribute('aria-label', 'John Doe');
  });

  it('applies custom styles', () => {
    render(
      <Avatar
        name="John Doe"
        style={{ border: '2px solid red', padding: '10px' }}
      />
    );
    const img = screen.getByRole('img', { name: 'John Doe' });
    expect(img).toHaveStyle({
      border: '2px solid red',
      padding: '10px',
    });
  });

  it('uses design tokens for styling', () => {
    render(<Avatar name="John Doe" />);
    const img = screen.getByRole('img', { name: 'John Doe' });
    const styles = window.getComputedStyle(img);
    // Check that design token CSS variables are applied
    expect(img).toHaveStyle({
      borderRadius: 'var(--gx-radius-pill)',
      background: 'var(--gx-accent-wash)',
      color: 'var(--gx-accent-text)',
      border: '1px solid var(--gx-hairline)',
    });
  });

  it('image has correct object-fit and size', () => {
    render(<Avatar name="John Doe" src="https://example.com/avatar.jpg" />);
    const innerImg = screen.getByRole('img', { name: 'John Doe' }).querySelector('img');
    expect(innerImg).toHaveStyle({
      inlineSize: '100%',
      blockSize: '100%',
      objectFit: 'cover',
    });
  });

  it('supports forward additional HTML attributes', () => {
    render(
      <Avatar
        name="John Doe"
        data-testid="custom-avatar"
        className="my-class"
      />
    );
    const img = screen.getByTestId('custom-avatar');
    expect(img).toHaveClass('my-class');
  });
});
