import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../../src/components/core/Badge';

describe('Badge', () => {
  it('renders with neutral tone by default', () => {
    render(<Badge>Neutral</Badge>);
    const badge = screen.getByText('Neutral');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({
      display: 'inline-flex',
      background: 'var(--gx-surface-raised)',
      color: 'var(--gx-text)',
      border: '1px solid var(--gx-hairline)',
    });
  });

  it('renders with accent tone', () => {
    render(<Badge tone="accent">Accent</Badge>);
    const badge = screen.getByText('Accent');
    expect(badge).toHaveStyle({
      background: 'var(--gx-accent-wash)',
      color: 'var(--gx-accent-text)',
      border: '1px solid var(--gx-accent-graphic)',
    });
  });

  it('renders with success tone', () => {
    render(<Badge tone="success">Success</Badge>);
    const badge = screen.getByText('Success');
    expect(badge).toHaveStyle({
      background: 'var(--gx-success-wash)',
      color: 'var(--gx-success)',
      border: '1px solid var(--gx-success)',
    });
  });

  it('renders with danger tone', () => {
    render(<Badge tone="danger">Danger</Badge>);
    const badge = screen.getByText('Danger');
    expect(badge).toHaveStyle({
      background: 'var(--gx-danger-wash)',
      color: 'var(--gx-danger)',
      border: '1px solid var(--gx-danger)',
    });
  });

  it('renders with warning tone', () => {
    render(<Badge tone="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');
    expect(badge).toHaveStyle({
      background: 'var(--gx-warning-wash)',
      color: 'var(--gx-warning)',
      border: '1px solid var(--gx-warning)',
    });
  });

  it('renders with icon slot', () => {
    render(
      <Badge icon={<span data-testid="badge-icon">✓</span>}>
        With Icon
      </Badge>
    );
    const icon = screen.getByTestId('badge-icon');
    const badge = screen.getByText('With Icon');
    expect(icon).toBeInTheDocument();
    expect(badge.parentElement).toContainElement(icon);
  });

  it('renders without icon when not provided', () => {
    render(<Badge>No Icon</Badge>);
    const badge = screen.getByText('No Icon');
    expect(badge).toBeInTheDocument();
  });

  it('applies custom styles override', () => {
    render(
      <Badge style={{ padding: '10px 16px', fontSize: '14px' }}>
        Custom Style
      </Badge>
    );
    const badge = screen.getByText('Custom Style');
    expect(badge).toHaveStyle({
      padding: '10px 16px',
      fontSize: '14px',
    });
  });

  it('uses design token CSS variables for styling', () => {
    render(<Badge tone="accent">Design Tokens</Badge>);
    const badge = screen.getByText('Design Tokens');
    expect(badge).toHaveStyle({
      font: 'var(--gx-weight-medium) 12px/1.3 var(--gx-font-mono)',
      letterSpacing: '0.04em',
      padding: '3px 8px',
      borderRadius: 'var(--gx-radius-sm)',
    });
  });

  it('supports forward additional HTML attributes', () => {
    render(
      <Badge data-testid="badge-element" className="custom-class" title="Badge">
        With Attributes
      </Badge>
    );
    const badge = screen.getByTestId('badge-element');
    expect(badge).toHaveAttribute('title', 'Badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('renders with icon and children together', () => {
    render(
      <Badge tone="success" icon={<span data-testid="success-icon">✓</span>}>
        Success Status
      </Badge>
    );
    const icon = screen.getByTestId('success-icon');
    const label = screen.getByText('Success Status');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label.parentElement).toContainElement(icon);
  });

  it('maintains inline-flex layout with gap spacing', () => {
    render(
      <Badge icon={<span data-testid="icon">Icon</span>}>Label</Badge>
    );
    const badge = screen.getByText('Label');
    expect(badge).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
    });
  });
});
