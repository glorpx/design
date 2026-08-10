import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Input } from '../../src/components/forms/Input';

describe('Input', () => {
  it('renders input element with default type="text" and forwards basic HTML attributes', () => {
    render(
      <Input
        placeholder="Enter text"
        value="test value"
        name="testInput"
        onChange={() => {}}
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('text');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('name', 'testInput');
    expect(input.value).toBe('test value');
  });

  it('renders with different input types and forwards type attribute', () => {
    const { rerender } = render(<Input type="email" />);
    let input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');

    rerender(<Input type="password" />);
    // password inputs don't have role="textbox" by default in DOM testing-library
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    rerender(<Input type="number" />);
    input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.type).toBe('number');
  });

  it('renders iconLeft element inside the visual wrapper', () => {
    const { container } = render(
      <Input iconLeft={<span data-testid="icon">🔍</span>} />
    );
    const wrapper = container.querySelector('.gx-field');
    const icon = screen.getByTestId('icon');

    expect(icon).toBeInTheDocument();
    expect(wrapper).toContainElement(icon);
    expect(icon.textContent).toBe('🔍');
  });

  it('wraps input in span with gx-field class and forwards className', () => {
    const { container } = render(<Input className="custom-class" />);
    const wrapper = container.querySelector('.gx-field');

    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('gx-field');
    expect(wrapper).toHaveClass('custom-class');
  });

  it('handles invalid state by applying data-invalid attribute and aria-invalid', () => {
    const { container } = render(<Input invalid={true} />);
    const wrapper = container.querySelector('.gx-field');
    const input = screen.getByRole('textbox');

    expect(wrapper).toHaveAttribute('data-invalid', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('triggers onChange handler when typing', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state', () => {
    const { container } = render(<Input disabled={true} />);
    const wrapper = container.querySelector('.gx-field');
    const input = screen.getByRole('textbox') as HTMLInputElement;

    expect(input.disabled).toBe(true);
    expect(wrapper).toHaveAttribute('data-disabled', 'true');
  });

  it('forwards additional rest HTML attributes to the input element', () => {
    render(
      <Input
        id="my-input"
        aria-label="Search field"
        data-custom="value"
        autoComplete="off"
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;

    expect(input).toHaveAttribute('id', 'my-input');
    expect(input).toHaveAttribute('aria-label', 'Search field');
    expect(input).toHaveAttribute('data-custom', 'value');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it('handles both invalid and disabled states simultaneously', () => {
    const { container } = render(<Input invalid={true} disabled={true} />);
    const wrapper = container.querySelector('.gx-field');
    const input = screen.getByRole('textbox') as HTMLInputElement;

    expect(wrapper).toHaveAttribute('data-invalid', 'true');
    expect(wrapper).toHaveAttribute('data-disabled', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toBeDisabled();
  });
});
