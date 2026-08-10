import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader } from '../../src/components/core/Card';

describe('Card', () => {
  it('renders default card with correct styles', () => {
    render(<Card data-testid="card">Card Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveStyle({
      background: 'var(--gx-surface)',
      border: '1px solid var(--gx-hairline)',
      borderRadius: 'var(--gx-radius-lg)',
      padding: 'calc(var(--gx-space-6) * var(--gx-density, 1))',
      boxShadow: 'none',
    });
  });

  it('applies elevated styles when elevated prop is true', () => {
    render(<Card elevated data-testid="card-elevated">Elevated Card</Card>);
    const card = screen.getByTestId('card-elevated');
    expect(card).toHaveStyle({
      background: 'var(--gx-surface-raised)',
      boxShadow: 'var(--gx-shadow-float)',
    });
  });

  it('renders as different HTML element using the polymorphic as prop', () => {
    const elements: Array<'div' | 'section' | 'article' | 'li'> = ['div', 'section', 'article', 'li'];
    for (const el of elements) {
      const { unmount } = render(
        <Card as={el} data-testid={`card-${el}`}>
          Card Content
        </Card>
      );
      const card = screen.getByTestId(`card-${el}`);
      expect(card.tagName).toBe(el.toUpperCase());
      unmount();
    }
  });

  it('applies custom padding calculation with density-awareness', () => {
    render(<Card padding="var(--gx-space-4)" data-testid="card-padding">Padding Card</Card>);
    const card = screen.getByTestId('card-padding');
    expect(card).toHaveStyle({
      padding: 'calc(var(--gx-space-4) * var(--gx-density, 1))',
    });
  });
});

describe('CardHeader', () => {
  it('renders title, eyebrow, and action slot correctly', () => {
    render(
      <CardHeader
        title="My Subheading"
        eyebrow="My Eyebrow"
        action={<button data-testid="header-action">Click me</button>}
        data-testid="card-header"
      />
    );

    const header = screen.getByTestId('card-header');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('My Subheading')).toBeInTheDocument();
    expect(screen.getByText('My Eyebrow')).toBeInTheDocument();
    expect(screen.getByTestId('header-action')).toBeInTheDocument();
  });
});
