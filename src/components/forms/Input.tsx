import React, { CSSProperties, ReactNode } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'disabled' | 'style'> {
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'number' | 'tel';
  invalid?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  style?: CSSProperties;
}

export function Input({
  type = 'text',
  invalid = false,
  disabled = false,
  iconLeft,
  className = '',
  style,
  ...rest
}: InputProps) {
  const box: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--gx-surface-raised)',
    border: `1px solid ${invalid ? 'var(--gx-danger)' : 'var(--gx-hairline)'}`,
    borderRadius: 'var(--gx-radius-md)',
    padding: '0 12px',
    blockSize: 'calc(max(var(--gx-target-min), 44px * var(--gx-density, 1)))',
    minBlockSize: 'var(--gx-target-min)',
    opacity: disabled ? 'var(--gx-disabled-opacity)' : 1,
    color: 'var(--gx-text-secondary)',
  };

  const field: CSSProperties = {
    all: 'unset',
    flex: 1,
    minInlineSize: 0,
    color: 'var(--gx-text)',
    font: '400 var(--gx-text-body)/1.4 var(--gx-font-ui)',
    fontFeatureSettings: 'var(--gx-font-features)',
  };

  return (
    <span
      className={['gx-field', className].filter(Boolean).join(' ')}
      data-disabled={disabled ? 'true' : undefined}
      data-invalid={invalid ? 'true' : undefined}
      style={{ ...box, ...style }}
    >
      {iconLeft}
      <input
        type={type}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        style={field}
        {...rest}
      />
    </span>
  );
}
