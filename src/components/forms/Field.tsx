import React, { ReactNode, CSSProperties } from 'react';
import { Icon } from '../core/Icon';

export interface FieldProps {
  label: ReactNode;
  /** Id given to the control; also seeds the help/error ids. */
  htmlFor?: string;
  help?: ReactNode;
  /** Plain-language error, e.g. "Email address is required." */
  error?: ReactNode;
  required?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

/**
 * Wraps a control with its label, help text and error. Wires up id/aria-describedby
 * and passes `invalid` down. Error copy is plain language — no slang, no jokes.
 */
export function Field({
  label,
  htmlFor,
  help,
  error,
  required = false,
  children,
  style,
}: FieldProps): JSX.Element {
  const helpId = htmlFor ? `${htmlFor}-help` : undefined;
  const errId = htmlFor ? `${htmlFor}-error` : undefined;

  const ariaDescribedBy = [help && helpId, error && errId]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <label
        htmlFor={htmlFor}
        style={{
          font: 'var(--gx-weight-medium) var(--gx-text-label)/1.3 var(--gx-font-ui)',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--gx-danger)' }} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            id: htmlFor,
            invalid: !!error,
            'aria-describedby': ariaDescribedBy,
          } as React.Attributes)
        : children}
      {help && !error && (
        <span
          id={helpId}
          style={{
            font: '400 var(--gx-text-caption)/1.5 var(--gx-font-ui)',
            color: 'var(--gx-text-secondary)',
          }}
        >
          {help}
        </span>
      )}
      {error && (
        <span
          id={errId}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            font: '400 var(--gx-text-caption)/1.5 var(--gx-font-ui)',
            color: 'var(--gx-danger)',
          }}
        >
          <Icon name="circle-alert" size={14} style={{ color: 'var(--gx-danger)' }} />
          {error}
        </span>
      )}
    </div>
  );
}
