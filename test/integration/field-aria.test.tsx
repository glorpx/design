import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Field } from '../../src/components/forms/Field';
import { Input } from '../../src/components/forms/Input';
import { Select } from '../../src/components/forms/Select';

describe('Field + Input integration', () => {
  it('wires up ID and ARIA attributes correctly when Input is wrapped in Field with help and error', () => {
    const { container } = render(
      <Field
        label="Username"
        htmlFor="username-input"
        help="Choose a unique username"
        error="Username is required"
      >
        <Input placeholder="Enter username" />
      </Field>
    );

    // Input element should be cloned with htmlFor ID
    const input = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username-input');

    // It should receive aria-describedby pointing to the generated help and error elements
    // Note: since error is present, help text is not rendered in the DOM,
    // but the input still receives the full aria-describedby attribute referencing both IDs
    expect(input).toHaveAttribute('aria-describedby', 'username-input-help username-input-error');

    // It should receive aria-invalid="true" because error is present
    expect(input).toHaveAttribute('aria-invalid', 'true');

    // Verify error element exists with the correct id
    const errorMsg = screen.getByText('Username is required');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveAttribute('id', 'username-input-error');
  });

  it('wires up aria-describedby correctly when only help is provided', () => {
    render(
      <Field
        label="Username"
        htmlFor="username-input"
        help="Choose a unique username"
      >
        <Input placeholder="Enter username" />
      </Field>
    );

    const input = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
    expect(input).toHaveAttribute('aria-describedby', 'username-input-help');
    expect(input).not.toHaveAttribute('aria-invalid');
  });
});

describe('Field + Select integration', () => {
  const options = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ];

  it('wires up ID and ARIA attributes correctly when Select is wrapped in Field with help and error', () => {
    const { container } = render(
      <Field
        label="Role"
        htmlFor="role-select"
        help="Select user permission role"
        error="Role selection is required"
      >
        <Select options={options} />
      </Field>
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('id', 'role-select');
    expect(select).toHaveAttribute('aria-describedby', 'role-select-help role-select-error');
    expect(select).toHaveAttribute('aria-invalid', 'true');

    const errorMsg = screen.getByText('Role selection is required');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveAttribute('id', 'role-select-error');
  });
});
