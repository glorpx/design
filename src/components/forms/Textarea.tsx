import React, { CSSProperties } from 'react';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled' | 'style'> {
  rows?: number;
  invalid?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Textarea({
  rows = 4,
  invalid = false,
  disabled = false,
  className = '',
  style,
  ...rest
}: TextareaProps) {
  const textareaStyle: CSSProperties = {
    background: 'var(--gx-surface-raised)',
    color: 'var(--gx-text)',
    border: `1px solid ${invalid ? 'var(--gx-danger)' : 'var(--gx-hairline)'}`,
    borderRadius: 'var(--gx-radius-md)',
    padding: '10px 12px',
    resize: 'vertical',
    font: '400 var(--gx-text-body)/var(--gx-lh-body) var(--gx-font-ui)',
    fontFeatureSettings: 'var(--gx-font-features)',
    opacity: disabled ? 'var(--gx-disabled-opacity)' : 1,
    inlineSize: '100%',
    ...style,
  };

  return (
    <textarea
      rows={rows}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={['gx-field', className].filter(Boolean).join(' ')}
      data-disabled={disabled ? 'true' : undefined}
      data-invalid={invalid ? 'true' : undefined}
      style={textareaStyle}
      {...rest}
    />
  );
}
