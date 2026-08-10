import React, { ReactNode, CSSProperties, ComponentPropsWithoutRef } from 'react';

type CardElementType = 'div' | 'section' | 'article' | 'li';

export interface CardProps extends Omit<ComponentPropsWithoutRef<'div'>, 'as'> {
  elevated?: boolean;
  as?: CardElementType;
  padding?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Card({
  elevated = false,
  as = 'div',
  padding = 'var(--gx-space-6)',
  children,
  style,
  ...rest
}: CardProps): JSX.Element {
  const Tag = as as React.ElementType;
  return (
    <Tag
      style={{
        background: elevated ? 'var(--gx-surface-raised)' : 'var(--gx-surface)',
        border: '1px solid var(--gx-hairline)',
        borderRadius: 'var(--gx-radius-lg)',
        padding: `calc(${padding} * var(--gx-density, 1))`,
        boxShadow: elevated ? 'var(--gx-shadow-float)' : 'none',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export interface CardHeaderProps extends ComponentPropsWithoutRef<'div'> {
  title: ReactNode;
  eyebrow?: string;
  action?: ReactNode;
  style?: CSSProperties;
}

export function CardHeader({
  title,
  eyebrow,
  action,
  style,
  ...rest
}: CardHeaderProps): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--gx-space-4)',
        marginBlockEnd: 'var(--gx-space-3)',
        ...style,
      }}
      {...rest}
    >
      <div>
        {eyebrow && (
          <div
            style={{
              font: 'var(--gx-weight-medium) var(--gx-text-eyebrow)/1.3 var(--gx-font-mono)',
              letterSpacing: 'var(--gx-track-eyebrow)',
              textTransform: 'uppercase',
              color: 'var(--gx-text-secondary)',
              marginBlockEnd: 6,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            font: 'var(--gx-weight-semibold) var(--gx-text-subheading)/1.35 var(--gx-font-display)',
            letterSpacing: 'var(--gx-track-heading)',
          }}
        >
          {title}
        </div>
      </div>
      {action}
    </div>
  );
}
