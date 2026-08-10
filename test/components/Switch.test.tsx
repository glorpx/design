import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Switch } from '../../src/components/forms/Switch';

describe('Switch', () => {
  it('renders switch button with role="switch" and label text', () => {
    render(<Switch label="Toggle on" />);
    const button = screen.getByRole('switch', { name: 'Toggle on' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(screen.getByText('Toggle on')).toBeInTheDocument();
  });

  it('renders correctly without label', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders checked and unchecked aria-checked status', () => {
    const { rerender } = render(<Switch checked={true} onChange={() => {}} />);
    let button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'true');

    rerender(<Switch checked={false} onChange={() => {}} />);
    button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'false');
  });

  it('triggers onChange with true when clicking unchecked switch', () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);
    const button = screen.getByRole('switch');
    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('triggers onChange with false when clicking checked switch', () => {
    const handleChange = vi.fn();
    render(<Switch checked={true} onChange={handleChange} />);
    const button = screen.getByRole('switch');
    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('handles disabled state correctly', () => {
    const handleChange = vi.fn();
    const { container } = render(<Switch disabled={true} onChange={handleChange} />);
    const button = screen.getByRole('switch') as HTMLButtonElement;
    const label = container.querySelector('label');

    expect(button.disabled).toBe(true);
    expect(label).toHaveAttribute('data-disabled', 'true');
    expect(label).toHaveStyle({
      cursor: 'not-allowed',
      opacity: 'var(--gx-disabled-opacity)',
    });

    fireEvent.click(button);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders decorative knob span with aria-hidden', () => {
    const { container } = render(<Switch checked={true} />);
    const knob = container.querySelector('button[role="switch"] span[aria-hidden="true"]');
    expect(knob).toBeInTheDocument();
  });

  it('forwards custom className and style', () => {
    const { container } = render(
      <Switch className="custom-switch" style={{ marginTop: '10px' }} />
    );
    const label = container.querySelector('label');
    expect(label).toHaveClass('custom-switch');
    expect(label).toHaveStyle({ marginTop: '10px' });
  });

  it('spreads extra attributes onto the button element', () => {
    render(<Switch id="my-switch" aria-describedby="help-text" />);
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('id', 'my-switch');
    expect(button).toHaveAttribute('aria-describedby', 'help-text');
  });
});
