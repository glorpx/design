import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Spinner } from '../../src/components/core/Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('gx-btn--primary');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('gx-btn--secondary');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('gx-btn--ghost');
    });

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('gx-btn--danger');
    });

    it('applies on-fill class for primary and danger', () => {
      const { rerender } = render(<Button variant="primary">Test</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('gx-on-fill');

      rerender(<Button variant="danger">Test</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('gx-on-fill');
    });

    it('does not apply on-fill for secondary and ghost', () => {
      const { rerender } = render(<Button variant="secondary">Test</Button>);
      let button = screen.getByRole('button');
      expect(button).not.toHaveClass('gx-on-fill');

      rerender(<Button variant="ghost">Test</Button>);
      button = screen.getByRole('button');
      expect(button).not.toHaveClass('gx-on-fill');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders medium size (default)', () => {
      render(<Button size="md">Medium</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders all 3 sizes correctly', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('disables the button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('sets cursor to not-allowed when disabled', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.querySelector('button');
      expect(button?.style.cursor).toBe('not-allowed');
    });

    it('does not trigger onClick when disabled', () => {
      const onClick = vi.fn();
      render(<Button disabled onClick={onClick}>Disabled</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('disables button when loading is true', () => {
      render(<Button loading>Content</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('sets aria-busy to true when loading', () => {
      const { container } = render(<Button loading>Content</Button>);
      const button = container.querySelector('button');
      expect(button?.getAttribute('aria-busy')).toBe('true');
    });

    it('sets cursor to not-allowed when loading', () => {
      const { container } = render(<Button loading>Content</Button>);
      const button = container.querySelector('button');
      expect(button?.style.cursor).toBe('not-allowed');
    });

    it('renders Spinner when loading', () => {
      render(<Button loading>Content</Button>);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('hides iconLeft and shows Spinner when loading', () => {
      const { container } = render(
        <Button loading iconLeft={<span data-testid="icon">Icon</span>}>
          Content
        </Button>
      );
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="icon"]')).not.toBeInTheDocument();
    });
  });

  describe('icon slots', () => {
    it('renders iconLeft', () => {
      const { container } = render(
        <Button iconLeft={<span data-testid="left-icon">L</span>}>Text</Button>
      );
      expect(container.querySelector('[data-testid="left-icon"]')).toBeInTheDocument();
    });

    it('renders iconRight', () => {
      const { container } = render(
        <Button iconRight={<span data-testid="right-icon">R</span>}>Text</Button>
      );
      expect(container.querySelector('[data-testid="right-icon"]')).toBeInTheDocument();
    });

    it('renders both icons with text', () => {
      const { container } = render(
        <Button
          iconLeft={<span data-testid="left">L</span>}
          iconRight={<span data-testid="right">R</span>}
        >
          Text
        </Button>
      );
      expect(container.querySelector('[data-testid="left"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="right"]')).toBeInTheDocument();
    });
  });

  describe('fullWidth', () => {
    it('applies fullWidth style when set', () => {
      const { container } = render(<Button fullWidth>Full</Button>);
      const button = container.querySelector('button');
      expect(button?.style.inlineSize).toBe('100%');
    });

    it('defaults to auto width', () => {
      const { container } = render(<Button>Auto</Button>);
      const button = container.querySelector('button');
      expect(button?.style.inlineSize).toBe('auto');
    });
  });

  describe('button type', () => {
    it('defaults to type="button"', () => {
      const { container } = render(<Button>Default</Button>);
      const button = container.querySelector('button');
      expect(button?.type).toBe('button');
    });

    it('accepts type="submit"', () => {
      const { container } = render(<Button type="submit">Submit</Button>);
      const button = container.querySelector('button');
      expect(button?.type).toBe('submit');
    });

    it('accepts type="reset"', () => {
      const { container } = render(<Button type="reset">Reset</Button>);
      const button = container.querySelector('button');
      expect(button?.type).toBe('reset');
    });
  });

  describe('onClick handler', () => {
    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      const button = screen.getByRole('button', { name: 'Click' });
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes event to onClick handler', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      const button = screen.getByRole('button', { name: 'Click' });
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('styling', () => {
    it('merges custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('gx-btn', 'custom-class');
    });

    it('merges custom styles', () => {
      const { container } = render(
        <Button style={{ color: 'red' }}>Styled</Button>
      );
      const button = container.querySelector('button');
      expect(button?.style.color).toBe('red');
    });

    it('applies display: inline-flex', () => {
      const { container } = render(<Button>Flex</Button>);
      const button = container.querySelector('button');
      expect(button?.style.display).toBe('inline-flex');
    });
  });

  describe('accessibility', () => {
    it('has accessible name from children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('sets aria-busy when loading', () => {
      render(<Button loading>Content</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('does not set aria-busy when not loading', () => {
      const { container } = render(<Button>Not loading</Button>);
      const button = container.querySelector('button');
      expect(button?.getAttribute('aria-busy')).not.toBe('true');
    });
  });

  describe('rest props', () => {
    it('spreads additional props to button element', () => {
      const { container } = render(
        <Button data-testid="custom-button" aria-describedby="help-text">
          Button
        </Button>
      );
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });
  });
});

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    const { container } = render(<Spinner size={24} />);
    const spinner = container.querySelector('[role="status"]');
    expect(spinner?.style.inlineSize).toBe('24px');
    expect(spinner?.style.blockSize).toBe('24px');
  });

  it('renders with custom label', () => {
    render(<Spinner label="Processing" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Processing');
  });

  it('has spinner class', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('[role="status"]');
    expect(spinner?.className).toContain('gx-spinner');
  });

  it('merges custom className', () => {
    const { container } = render(<Spinner className="custom-spinner" />);
    const spinner = container.querySelector('[role="status"]');
    expect(spinner?.className).toContain('gx-spinner');
    expect(spinner?.className).toContain('custom-spinner');
  });

  it('applies spinner animation', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('[role="status"]');
    expect(spinner?.style.animation).toContain('gx-spin');
  });

  it('applies circular styles', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('[role="status"]');
    expect(spinner?.style.borderRadius).toBe('50%');
    expect(spinner?.style.display).toBe('inline-block');
  });

  it('spreads additional props', () => {
    const { container } = render(
      <Spinner data-testid="custom-spinner" aria-describedby="loading" />
    );
    const spinner = container.querySelector('[role="status"]');
    expect(spinner).toHaveAttribute('data-testid', 'custom-spinner');
    expect(spinner).toHaveAttribute('aria-describedby', 'loading');
  });
});
