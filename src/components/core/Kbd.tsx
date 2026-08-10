import React, { ReactNode, CSSProperties } from 'react';

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  style?: CSSProperties;
}

export function Kbd({
  children,
  style,
  ...rest
}: KbdProps): JSX.Element {
  return (
    <kbd
      style={{
        display: 'inline-block',
        font: 'var(--gx-weight-medium) 12px/1 var(--gx-font-mono)',
        padding: '4px 6px',
        minInlineSize: 20,
        textAlign: 'center',
        background: 'var(--gx-surface-raised)',
        color: 'var(--gx-text)',
        border: '1px solid var(--gx-hairline)',
        borderBottomWidth: 2,
        borderRadius: 'var(--gx-radius-sm)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </kbd>
  );
}

export type { KbdProps };
