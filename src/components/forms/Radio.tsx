import React, { ReactNode, CSSProperties } from 'react';

export interface RadioProps {
  name: string;
  value?: string;
  label?: ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Merged with the component's own state classes (see tokens/states.css). */
  className?: string;
  style?: CSSProperties;
}

/** One mutually-exclusive option. Always inside a RadioGroup so the set has a legend. */
export function Radio({
  name,
  value,
  label,
  checked = false,
  disabled = false,
  onChange,
  className = '',
  style,
  ...rest
}: RadioProps & React.InputHTMLAttributes<HTMLInputElement>) {
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
        }}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          style={{
            appearance: 'none',
            margin: 0,
            inlineSize: 20,
            blockSize: 20,
            borderRadius: '50%',
            cursor: 'inherit',
            background: 'var(--gx-surface-raised)',
            border: `1px solid ${checked ? 'var(--gx-accent-solid)' : 'var(--gx-hairline)'}`,
          }}
          {...rest}
        />
        {checked && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inlineSize: 10,
              blockSize: 10,
              borderRadius: '50%',
              background: 'var(--gx-accent-solid)',
              pointerEvents: 'none',
            }}
          />
        )}
      </span>
      <span>{label}</span>
    </label>
  );
}

export interface RadioGroupProps {
  legend: ReactNode;
  orientation?: 'vertical' | 'horizontal';
  children?: ReactNode;
  /** Merged with the component's own state classes (see tokens/states.css). */
  className?: string;
  style?: CSSProperties;
}

/** A group of mutually-exclusive radio options with a legend. */
export function RadioGroup({
  legend,
  children,
  orientation = 'vertical',
  className = '',
  style,
}: RadioGroupProps) {
  return (
    <fieldset
      className={className}
      style={{
        border: 0,
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      <legend
        style={{
          font: 'var(--gx-weight-medium) var(--gx-text-label)/1.3 var(--gx-font-ui)',
          marginBlockEnd: 8,
          padding: 0,
        }}
      >
        {legend}
      </legend>
      <div
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: orientation === 'vertical' ? 4 : 'var(--gx-space-5)',
        }}
      >
        {children}
      </div>
    </fieldset>
  );
}
