import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../../src/components/forms/Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    const label = screen.getByText('Accept terms');
    expect(label).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('fires onChange handler when clicked in uncontrolled mode', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Test" onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    checkbox.click();
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();
  });

  it('handles controlled checked state', () => {
    const { rerender } = render(<Checkbox checked={false} onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    rerender(<Checkbox checked={true} onChange={() => {}} />);
    expect(checkbox.checked).toBe(true);
  });

  it('uses defaultChecked for uncontrolled initial state', () => {
    render(<Checkbox defaultChecked={true} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('sets indeterminate property on input element', () => {
    render(<Checkbox indeterminate={true} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('updates indeterminate property when prop changes', () => {
    const { rerender } = render(<Checkbox indeterminate={false} />);
    let checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(false);

    rerender(<Checkbox indeterminate={true} />);
    checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('renders indeterminate glyph when indeterminate is true and checked is false', () => {
    render(<Checkbox indeterminate={true} checked={false} onChange={() => {}} />);
    const glyph = screen.getByText('–');
    expect(glyph).toBeInTheDocument();
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders check glyph when checked is true', () => {
    render(<Checkbox checked={true} onChange={() => {}} />);
    const glyph = screen.getByText('✓');
    expect(glyph).toBeInTheDocument();
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render glyph when unchecked and not indeterminate', () => {
    render(<Checkbox checked={false} onChange={() => {}} />);
    const checkGlyph = screen.queryByText('✓');
    const indeterminateGlyph = screen.queryByText('–');
    expect(checkGlyph).not.toBeInTheDocument();
    expect(indeterminateGlyph).not.toBeInTheDocument();
  });

  it('disables checkbox when disabled prop is true', () => {
    render(<Checkbox disabled={true} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });

  it('sets data-disabled attribute when disabled', () => {
    const { container } = render(<Checkbox disabled={true} label="Disabled" />);
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('data-disabled', 'true');
  });

  it('applies className to the label element', () => {
    const { container } = render(<Checkbox className="custom-class" />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('gx-choice');
    expect(label).toHaveClass('custom-class');
  });

  it('applies style to the label element', () => {
    const { container } = render(
      <Checkbox style={{ marginTop: '10px' }} />
    );
    const label = container.querySelector('label');
    expect(label).toHaveStyle({ marginTop: '10px' });
  });

  it('applies gx-on-fill class to input when checked', () => {
    const { container } = render(<Checkbox checked={true} onChange={() => {}} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveClass('gx-on-fill');
  });

  it('applies gx-on-fill class to input when indeterminate', () => {
    const { container } = render(<Checkbox indeterminate={true} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).toHaveClass('gx-on-fill');
  });

  it('does not apply gx-on-fill class when unchecked and not indeterminate', () => {
    const { container } = render(<Checkbox checked={false} onChange={() => {}} />);
    const input = container.querySelector('input[type="checkbox"]');
    expect(input).not.toHaveClass('gx-on-fill');
  });

  it('uses design token CSS variables for styling', () => {
    const { container } = render(<Checkbox label="Test" />);
    const label = container.querySelector('label');
    expect(label).toHaveStyle({
      minBlockSize: 'var(--gx-target-min)',
      font: '400 var(--gx-text-body-sm)/1.4 var(--gx-font-ui)',
    });
  });

  it('responds to multiple clicks in uncontrolled mode', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    checkbox.click();
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();

    checkbox.click();
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(checkbox).not.toBeChecked();
  });

  it('stays checked in controlled mode when onChange does not update prop', () => {
    const { rerender } = render(
      <Checkbox checked={true} onChange={() => {}} />
    );
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    checkbox.click();
    // Checkbox is still checked because we didn't update the prop
    expect(checkbox.checked).toBe(true);
  });
});
