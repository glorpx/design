import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Radio, RadioGroup } from '../../src/components/forms/Radio';

describe('Radio', () => {
  it('renders radio input with label', () => {
    render(<Radio name="test" value="opt1" label="Option 1" onChange={() => {}} />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute('name', 'test');
    expect(radio).toHaveAttribute('value', 'opt1');
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Radio name="test" value="opt1" onChange={() => {}} />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
  });

  it('renders checked state correctly', () => {
    render(<Radio name="test" value="opt1" checked onChange={() => {}} />);
    const radio = screen.getByRole('radio') as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  it('renders unchecked state correctly', () => {
    render(<Radio name="test" value="opt1" checked={false} onChange={() => {}} />);
    const radio = screen.getByRole('radio') as HTMLInputElement;
    expect(radio.checked).toBe(false);
  });

  it('displays dot overlay when checked', () => {
    const { container } = render(<Radio name="test" value="opt1" checked onChange={() => {}} />);
    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({
      background: 'var(--gx-accent-solid)',
      borderRadius: '50%',
      pointerEvents: 'none',
    });
  });

  it('does not display dot overlay when unchecked', () => {
    const { container } = render(<Radio name="test" value="opt1" checked={false} onChange={() => {}} />);
    const dot = container.querySelector('span[aria-hidden="true"]');
    expect(dot).not.toBeInTheDocument();
  });

  it('fires onChange handler when clicked', () => {
    const handleChange = vi.fn();
    render(<Radio name="test" value="opt1" onChange={handleChange} />);
    const radio = screen.getByRole('radio');
    fireEvent.click(radio);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Radio name="test" value="opt1" disabled onChange={handleChange} />
    );
    const radio = screen.getByRole('radio') as HTMLInputElement;
    const label = container.querySelector('label');

    expect(radio.disabled).toBe(true);
    expect(label).toHaveAttribute('data-disabled', 'true');
    expect(label).toHaveStyle({
      cursor: 'not-allowed',
      opacity: 'var(--gx-disabled-opacity)',
    });
  });

  it('forwards HTML attributes to the input element', () => {
    render(
      <Radio
        name="test"
        value="opt1"
        id="radio-opt1"
        aria-describedby="help-text"
        onChange={() => {}}
      />
    );
    const radio = screen.getByRole('radio') as HTMLInputElement;
    expect(radio).toHaveAttribute('id', 'radio-opt1');
    expect(radio).toHaveAttribute('aria-describedby', 'help-text');
  });
});

describe('RadioGroup', () => {
  it('renders fieldset and legend correctly', () => {
    render(
      <RadioGroup legend="Select an option">
        <Radio name="opts" value="1" label="One" onChange={() => {}} />
      </RadioGroup>
    );

    const legend = screen.getByText('Select an option');
    expect(legend).toBeInTheDocument();
    expect(legend.tagName).toBe('LEGEND');
  });

  it('applies vertical layout by default', () => {
    const { container } = render(
      <RadioGroup legend="Opts">
        <Radio name="opts" value="1" label="One" onChange={() => {}} />
      </RadioGroup>
    );

    const flexContainer = container.querySelector('fieldset > div');
    expect(flexContainer).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    });
  });

  it('applies horizontal layout orientation', () => {
    const { container } = render(
      <RadioGroup legend="Opts" orientation="horizontal">
        <Radio name="opts" value="1" label="One" onChange={() => {}} />
      </RadioGroup>
    );

    const flexContainer = container.querySelector('fieldset > div');
    expect(flexContainer).toHaveStyle({
      display: 'flex',
      flexDirection: 'row',
      gap: 'var(--gx-space-5)',
    });
  });

  it('forwards custom className and style to fieldset', () => {
    const { container } = render(
      <RadioGroup legend="Opts" className="custom-group" style={{ margin: '10px' }}>
        <Radio name="opts" value="1" label="One" onChange={() => {}} />
      </RadioGroup>
    );

    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toHaveClass('custom-group');
    expect(fieldset).toHaveStyle({ margin: '10px' });
  });
});
