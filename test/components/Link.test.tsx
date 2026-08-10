import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Link } from '../../src/components/core/Link';

describe('Link', () => {
  it('renders a default link with href', () => {
    render(<Link href="/home">Home</Link>);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('renders external link correctly', () => {
    render(<Link href="https://example.com" external>External link</Link>);
    const link = screen.getByRole('link', { name: /External link/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer noopener');
    expect(screen.getByText('↗')).toBeInTheDocument();
  });

  it('applies accent tone styles by default', () => {
    render(<Link href="/accent">Accent Link</Link>);
    const link = screen.getByRole('link', { name: 'Accent Link' });
    expect(link).toHaveStyle({
      color: 'var(--gx-accent-text)',
      textDecoration: 'underline',
    });
  });

  it('applies ink tone styles', () => {
    render(<Link href="/ink" tone="ink">Ink Link</Link>);
    const link = screen.getByRole('link', { name: 'Ink Link' });
    expect(link).toHaveStyle({
      color: 'var(--gx-text)',
      textDecoration: 'underline',
    });
  });

  it('forwards custom styles and classes', () => {
    render(<Link href="/custom" className="my-link" style={{ fontWeight: 'bold' }}>Custom</Link>);
    const link = screen.getByRole('link', { name: 'Custom' });
    expect(link).toHaveClass('gx-link');
    expect(link).toHaveClass('my-link');
    expect(link).toHaveStyle({ fontWeight: 'bold' });
  });
});
