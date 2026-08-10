import React, { CSSProperties } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'disabled' | 'style'> {
  options?: SelectOption[];
  invalid?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

/**
 * Select control with native functionality, custom styling, and decorative chevron.
 * The wrapper uses relative positioning to place the chevron arrow absolutely.
 */
export function Select({
  options = [],
  invalid = false,
  disabled = false,
  className = '',
  style,
  ...rest
}: SelectProps) {
  const wrapper: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    inlineSize: '100%',
    ...style,
  };

  const selectStyles: CSSProperties = {
    appearance: 'none',
    inlineSize: '100%',
    background: 'var(--gx-surface-raised)',
    color: 'var(--gx-text)',
    border: `1px solid ${invalid ? 'var(--gx-danger)' : 'var(--gx-hairline)'}`,
    borderRadius: 'var(--gx-radius-md)',
    padding: '0 34px 0 12px',
    blockSize: 'calc(max(var(--gx-target-min), 44px * var(--gx-density, 1)))',
    minBlockSize: 'var(--gx-target-min)',
    font: '400 var(--gx-text-body)/1.4 var(--gx-font-ui)',
    opacity: disabled ? 'var(--gx-disabled-opacity)' : 1,
  };

  const chevron: CSSProperties = {
    position: 'absolute',
    insetInlineEnd: 12,
    color: 'var(--gx-accent-graphic)',
    pointerEvents: 'none',
    font: '400 var(--gx-text-caption)/1 var(--gx-font-mono)',
  };

  return (
    <span className={['gx-field', className].filter(Boolean).join(' ')} style={wrapper}>
      <select
        disabled={disabled}
        aria-invalid={invalid || undefined}
        data-disabled={disabled ? 'true' : undefined}
        data-invalid={invalid ? 'true' : undefined}
        style={selectStyles}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span aria-hidden="true" style={chevron}>
        ▾
      </span>
    </span>
  );
}
