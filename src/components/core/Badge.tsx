import { ReactNode, CSSProperties } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'danger' | 'warning';

interface ToneTokens {
  bg: string;
  fg: string;
  bd: string;
}

interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
  [key: string]: unknown;
}

const tones: Record<BadgeTone, ToneTokens> = {
  neutral: {
    bg: 'var(--gx-surface-raised)',
    fg: 'var(--gx-text)',
    bd: 'var(--gx-hairline)',
  },
  accent: {
    bg: 'var(--gx-accent-wash)',
    fg: 'var(--gx-accent-text)',
    bd: 'var(--gx-accent-graphic)',
  },
  success: {
    bg: 'var(--gx-success-wash)',
    fg: 'var(--gx-success)',
    bd: 'var(--gx-success)',
  },
  danger: {
    bg: 'var(--gx-danger-wash)',
    fg: 'var(--gx-danger)',
    bd: 'var(--gx-danger)',
  },
  warning: {
    bg: 'var(--gx-warning-wash)',
    fg: 'var(--gx-warning)',
    bd: 'var(--gx-warning)',
  },
};

export function Badge({
  tone = 'neutral',
  icon,
  children,
  style,
  ...rest
}: BadgeProps): JSX.Element {
  const t = tones[tone];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        font: 'var(--gx-weight-medium) 12px/1.3 var(--gx-font-mono)',
        letterSpacing: '0.04em',
        padding: '3px 8px',
        borderRadius: 'var(--gx-radius-sm)',
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}

export type { BadgeProps };
