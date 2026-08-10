import type { CSSProperties, ReactNode } from 'react';
import React from 'react';

/** Hyperlink component with optional external link styling. */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  tone?: 'accent' | 'ink';
  children?: ReactNode;
  style?: CSSProperties;
}

export function Link({
  href,
  external = false,
  tone = 'accent',
  className = '',
  children,
  style,
  ...rest
}: LinkProps): JSX.Element {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      className={['gx-link', className].filter(Boolean).join(' ')}
      style={{
        color: tone === 'accent' ? 'var(--gx-accent-text)' : 'var(--gx-text)',
        textDecoration: 'underline',
        textUnderlineOffset: 2,
        textDecorationThickness: 1,
        borderRadius: 'var(--gx-radius-sm)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {external && <span aria-hidden="true"> ↗</span>}
    </a>
  );
}
