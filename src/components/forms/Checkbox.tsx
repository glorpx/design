import React, { ReactNode, CSSProperties, useRef, useState, useEffect } from 'react';

export interface CheckboxProps {
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  /** Mixed state for parent rows in a group. */
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Merged with the component's own state classes (see tokens/states.css). */
  className?: string;
  style?: CSSProperties;
}

/** Boolean control with an inline label; the whole label is the 44px-tall target. */
export function Checkbox({
  label,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  onChange,
  className = '',
  style,
  ...rest
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);
  const controlled = checked !== undefined;
  const [inner, setInner] = useState(!!defaultChecked);
  const on = controlled ? checked : inner;

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!controlled) {
      setInner(e.target.checked);
    }
    onChange?.(e);
  };

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
      <span
        style={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          flex: 'none',
          inlineSize: 20,
          blockSize: 20,
        }}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={on}
          disabled={disabled}
          onChange={handle}
          className={on || indeterminate ? 'gx-on-fill' : undefined}
          style={{
            appearance: 'none',
            margin: 0,
            boxSizing: 'border-box',
            inlineSize: 20,
            blockSize: 20,
            cursor: 'inherit',
            background: on || indeterminate ? 'var(--gx-accent-solid)' : 'var(--gx-surface-raised)',
            border: `1px solid ${on || indeterminate ? 'transparent' : 'var(--gx-hairline)'}`,
            borderRadius: 'var(--gx-radius-sm)',
          }}
          {...rest}
        />
        {(on || indeterminate) && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              color: 'var(--gx-accent-solid-label)',
              font: '700 12px/1 var(--gx-font-ui)',
              pointerEvents: 'none',
            }}
          >
            {indeterminate && !on ? '–' : '✓'}
          </span>
        )}
      </span>
      <span>{label}</span>
    </label>
  );
}
