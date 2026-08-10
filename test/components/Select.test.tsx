import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Select } from '../../src/components/forms/Select';

describe('Select', () => {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];

  it('renders native select and option elements with correct labels and values', () => {
    render(<Select options={options} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    const optionElements = screen.getAllByRole('option') as HTMLOptionElement[];
    expect(optionElements).toHaveLength(3);

    expect(optionElements[0]).toHaveTextContent('Apple');
    expect(optionElements[0].value).toBe('apple');

    expect(optionElements[1]).toHaveTextContent('Banana');
    expect(optionElements[1].value).toBe('banana');

    expect(optionElements[2]).toHaveTextContent('Cherry');
    expect(optionElements[2].value).toBe('cherry');
  });

  it('handles change events by calling onChange handler with correct value', () => {
    const handleChange = vi.fn();
    render(<Select options={options} onChange={handleChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'banana' } });

    expect(handleChange).toHaveBeenCalledOnce();
    expect(select.value).toBe('banana');
  });

  it('handles invalid state by applying data-invalid attribute and aria-invalid', () => {
    const { rerender } = render(<Select options={options} invalid={false} />);
    let select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).not.toHaveAttribute('data-invalid');
    expect(select).not.toHaveAttribute('aria-invalid');

    rerender(<Select options={options} invalid={true} />);
    select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toHaveAttribute('data-invalid', 'true');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles disabled state', () => {
    const { container } = render(<Select options={options} disabled={true} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const wrapper = container.querySelector('.gx-field');

    expect(select.disabled).toBe(true);
    expect(select).toHaveAttribute('data-disabled', 'true');
    expect(wrapper).toHaveStyle({
      position: 'relative',
      display: 'inline-flex',
    });
  });

  it('renders decorative chevron arrow with aria-hidden', () => {
    render(<Select options={options} />);
    const chevron = screen.getByText('▾');
    expect(chevron).toBeInTheDocument();
    expect(chevron).toHaveAttribute('aria-hidden', 'true');
    expect(chevron).toHaveStyle({
      position: 'absolute',
      pointerEvents: 'none',
    });
  });

  it('handles both invalid and disabled states simultaneously', () => {
    render(<Select options={options} invalid={true} disabled={true} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute('data-disabled', 'true');
    expect(select).toHaveAttribute('data-invalid', 'true');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders with empty options array', () => {
    render(<Select options={[]} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    const optionElements = screen.queryAllByRole('option');
    expect(optionElements).toHaveLength(0);
  });

  it('renders without options prop', () => {
    render(<Select />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeInTheDocument();
  });
});
