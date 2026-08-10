import React, { ReactNode, CSSProperties } from 'react';

export interface SwitchProps {
  label?: ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

/** Boolean toggle control rendered as a semantic switch button with an inline label. */
export function Switch({
  label,
  checked = false,
  disabled = false,
  onChange,
  className = '',
  style,
  ...rest
}: SwitchProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <label
      className={['gx-choice', className].filter(Boolean).join(' ')}
      data-disabled={disabled ? 'true' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        minBlockSize: 'var(--gx-target-min)',
        opacity: disabled ? 'var(--gx-disabled-opacity)' : 1,
        font: '400 var(--gx-text-body-sm)/1.4 var(--gx-font-ui)',
        ...style,
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={checked ? 'gx-on-fill' : undefined}
        onClick={() => onChange?.(!!checked ? false : true)}
        style={{
          all: 'unset',
          boxSizing: 'border-box',
          cursor: 'inherit',
          flex: 'none',
          inlineSize: 40,
          blockSize: 22,
          borderRadius: 'var(--gx-radius-pill)',
          background: checked ? 'var(--gx-accent-solid)' : 'var(--gx-surface-raised)',
          border: `1px solid ${checked ? 'var(--gx-accent-solid)' : 'var(--gx-hairline)'}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 2px',
          transition: 'background var(--gx-duration-fast) var(--gx-ease-standard)',
        }}
        {...rest}
      >
        <span
          aria-hidden="true"
          style={{
            boxSizing: 'border-box',
            inlineSize: 16,
            blockSize: 16,
            borderRadius: '50%',
            background: checked ? 'var(--gx-accent-solid-label)' : 'var(--gx-text-secondary)',
            transform: `translateX(${checked ? 18 : 0}px)`,
            transition: 'transform var(--gx-duration-fast) var(--gx-ease-standard)',
          }}
        />
      </button>
      <span>{label}</span>
    </label>
  );
}
