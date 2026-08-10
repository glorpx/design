import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Footer, FooterLink, FooterColumn } from '../../src/components/brand/Footer';

describe('Footer', () => {
  const sampleLinks: FooterLink[] = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms', external: true },
  ];

  const sampleColumns: FooterColumn[] = [
    {
      title: 'Products',
      links: [
        { label: 'Design', href: '/design' },
        { label: 'CLI', href: '/cli' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Github', href: 'https://github.com/glorpx' },
      ],
    },
  ];

  it('renders short (default) variant correctly', () => {
    const { container } = render(
      <Footer note="Test Note" links={sampleLinks} year="2026" />
    );

    // Verify wrapper classes
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('gx-ft', 'gx-ft__row', 'gx-ft--pad');

    // Verify note text and Logo presence
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();

    // Verify custom year
    expect(screen.getByText('2026')).toBeInTheDocument();

    // Verify links
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  it('renders long variant correctly', () => {
    const { container } = render(
      <Footer
        variant="long"
        quote="Glorpx is life."
        signoff="Sign off."
        year="2026"
      />
    );

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('gx-ft', 'gx-ft--pad');

    expect(screen.getByText('“Glorpx is life.”')).toBeInTheDocument();
    expect(screen.getByText('Sign off.')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('renders bar variant correctly', () => {
    const { container } = render(<Footer variant="bar" note="Bar Note" year="2026" />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('gx-ft', 'gx-ft__row');
    expect(screen.getByText('Bar Note')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('renders stack variant correctly with columns', () => {
    const { container } = render(
      <Footer
        variant="stack"
        note="Stack Note"
        columns={sampleColumns}
        year="2026"
      />
    );

    expect(screen.getByText('Stack Note')).toBeInTheDocument();

    // Check headings (DOM holds case as-is, styling does uppercase)
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();

    // Check inner links
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('CLI')).toBeInTheDocument();
    expect(screen.getByText('Github')).toBeInTheDocument();
  });

  it('renders mono variant correctly', () => {
    render(<Footer variant="mono" signoff="Short Sign" year="2026" />);
    expect(screen.getByText('Short Sign')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });
});
