import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Textarea } from '../../src/components/forms/Textarea';

describe('Textarea', () => {
  it('renders textarea element with default rows=4 and forwards basic HTML attributes', () => {
    render(
      <Textarea
        placeholder="Enter text"
        name="testTextarea"
        defaultValue="test value"
      />
    );
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(textarea).toBeInTheDocument();
    expect(textarea.rows).toBe(4);
    expect(textarea).toHaveAttribute('placeholder', 'Enter text');
    expect(textarea).toHaveAttribute('name', 'testTextarea');
    expect(textarea.value).toBe('test value');
  });

  it('renders with custom rows attribute', () => {
    const { rerender } = render(<Textarea rows={8} />);
    let textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(8);

    rerender(<Textarea rows={1} />);
    textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(1);
  });

  it('wraps textarea with gx-field class and forwards className', () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(textarea).toHaveClass('gx-field');
    expect(textarea).toHaveClass('custom-class');
  });

  it('handles invalid state by applying data-invalid attribute and aria-invalid', () => {
    const { rerender } = render(<Textarea invalid={true} />);
    let textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(textarea).toHaveAttribute('data-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');

    rerender(<Textarea invalid={false} />);
    textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(textarea).not.toHaveAttribute('data-invalid');
    expect(textarea).not.toHaveAttribute('aria-invalid');
  });

  it('handles disabled state correctly', () => {
    render(<Textarea disabled={true} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    expect(textarea.disabled).toBe(true);
    expect(textarea).toHaveAttribute('data-disabled', 'true');
  });

  it('triggers onChange handler when typing', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('forwards custom style overrides', () => {
    render(<Textarea style={{ color: 'red', marginTop: '10px' }} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.style.color).toBe('red');
    expect(textarea.style.marginTop).toBe('10px');
  });

  it('spreads additional attributes to input element', () => {
    render(<Textarea id="my-textarea" data-test="custom" autoComplete="off" />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute('id', 'my-textarea');
    expect(textarea).toHaveAttribute('data-test', 'custom');
    expect(textarea).toHaveAttribute('autoComplete', 'off');
  });
});
