import React, { CSSProperties } from 'react';

interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  style?: CSSProperties;
}

export function Divider({
  orientation = 'horizontal',
  label,
  style,
  ...rest
}: DividerProps): JSX.Element {
  if (label) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--gx-space-3)',
          ...style,
        }}
        {...rest}
      >
        <span
          style={{
            flex: 1,
            blockSize: 1,
            background: 'var(--gx-hairline)',
          }}
        />
        <span
          style={{
            font: 'var(--gx-weight-medium) 12px/1.3 var(--gx-font-mono)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--gx-text-secondary)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            flex: 1,
            blockSize: 1,
            background: 'var(--gx-hairline)',
          }}
        />
      </div>
    );
  }

  return (
    <hr
      aria-orientation={orientation}
      style={{
        border: 0,
        margin: 0,
        alignSelf: 'stretch',
        ...(orientation === 'vertical'
          ? { inlineSize: 1, blockSize: 'auto' }
          : { blockSize: 1 }),
        background: 'var(--gx-hairline)',
        ...style,
      }}
      {...rest}
    />
  );
}

export type { DividerProps };
