import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { IconButton } from '../../src/components/core/IconButton';

describe('IconButton', () => {
  it('renders with correct accessibility properties (aria-label and type="button")', () => {
    render(<IconButton label="Close settings">✖</IconButton>);
    const button = screen.getByRole('button', { name: 'Close settings' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Close settings');
  });

  it('supports toggle pressed attribute and variant ghost style changes', () => {
    // Assert on DOM attributes using RTL
    const { rerender } = render(
      <IconButton label="Pin" variant="ghost" pressed={false}>
        📌
      </IconButton>
    );
    const button = screen.getByRole('button', { name: 'Pin' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <IconButton label="Pin" variant="ghost" pressed={true}>
        📌
      </IconButton>
    );
    expect(button).toHaveAttribute('aria-pressed', 'true');

    // Assert on exact inline styles by inspecting the VDOM element directly to bypass JSDOM CSS-parser bugs
    const vdomGhostUnpressed = IconButton({ label: 'Pin', variant: 'ghost', pressed: false });
    expect(vdomGhostUnpressed.props.style.background).toBe('transparent');

    const vdomGhostPressed = IconButton({ label: 'Pin', variant: 'ghost', pressed: true });
    expect(vdomGhostPressed.props.style.background).toBe('var(--gx-accent-wash)');
  });

  it('applies sizes and styles properly', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
    const sizeMap = {
      sm: 44,
      md: 48,
      lg: 56,
    };

    // Assert on sizing styles using VDOM inspection
    sizes.forEach((size) => {
      const vdom = IconButton({ label: `Size ${size}`, size });
      const expectedBox = `calc(max(var(--gx-target-min), ${sizeMap[size]}px * var(--gx-density, 1)))`;
      expect(vdom.props.style.inlineSize).toBe(expectedBox);
      expect(vdom.props.style.blockSize).toBe(expectedBox);
    });
  });

  it('behaves correctly in disabled state', () => {
    const handleClick = vi.fn();
    render(
      <IconButton label="Disabled action" disabled onClick={handleClick}>
        ✖
      </IconButton>
    );
    const button = screen.getByRole('button', { name: 'Disabled action' });
    
    // Assert behavior & DOM attributes
    expect(button).toBeDisabled();
    button.click();
    expect(handleClick).not.toHaveBeenCalled();

    // Assert style properties via VDOM inspection
    const vdomDisabled = IconButton({ label: 'Disabled action', disabled: true });
    expect(vdomDisabled.props.style.cursor).toBe('not-allowed');
    expect(vdomDisabled.props.style.opacity).toBe('var(--gx-disabled-opacity)');
  });

  it('fires onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<IconButton label="Click me" onClick={handleClick}>✖</IconButton>);
    const button = screen.getByRole('button', { name: 'Click me' });
    
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
