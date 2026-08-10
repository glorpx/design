import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Field } from '../../src/components/forms/Field';

describe('Field', () => {
  it('renders label and links htmlFor attribute', () => {
    render(
      <Field label="Email" htmlFor="email">
        <input type="text" />
      </Field>
    );

    const label = screen.getByText('Email');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'email');

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('renders required asterisk when required is true', () => {
    render(
      <Field label="Name" htmlFor="name" required>
        <input type="text" />
      </Field>
    );

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render asterisk when required is false', () => {
    render(
      <Field label="Optional Field" htmlFor="optional">
        <input type="text" />
      </Field>
    );

    const asterisks = screen.queryAllByText('*');
    expect(asterisks).toHaveLength(0);
  });

  it('renders help text when no error is present', () => {
    render(
      <Field label="Password" htmlFor="password" help="At least 8 characters">
        <input type="password" />
      </Field>
    );

    const helpText = screen.getByText('At least 8 characters');
    expect(helpText).toBeInTheDocument();
    expect(helpText).toHaveAttribute('id', 'password-help');
  });

  it('does not render help text when error is present', () => {
    render(
      <Field
        label="Email"
        htmlFor="email"
        help="example@domain.com"
        error="Email is required"
      >
        <input type="email" />
      </Field>
    );

    // Help should be completely omitted from the document when there's an error
    expect(screen.queryByText('example@domain.com')).not.toBeInTheDocument();

    // Error should be present
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('renders error message and icon', () => {
    const { container } = render(
      <Field label="Email" htmlFor="email" error="Invalid email">
        <input type="email" />
      </Field>
    );

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    
    // Icon component renders a span with role="presentation" and style sizing
    const iconElement = container.querySelector('span[role="presentation"]');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveStyle({
      inlineSize: '14px',
      blockSize: '14px',
    });
  });

  it('clones valid React element and passes down descriptors', () => {
    const { container } = render(
      <Field label="Email" htmlFor="email" help="Help text" error="Error text">
        <input type="email" />
      </Field>
    );

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('aria-describedby', 'email-help email-error');
  });

  it('accepts ReactNode for label, help, and error', () => {
    render(
      <Field
        label={<strong>Bold Label</strong>}
        htmlFor="test"
        error={<span data-testid="error-node">Error node</span>}
      >
        <input type="text" />
      </Field>
    );

    expect(screen.getByText('Bold Label')).toBeInTheDocument();
    expect(screen.getByTestId('error-node')).toBeInTheDocument();
  });
});
