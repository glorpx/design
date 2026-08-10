import { CSSProperties, MouseEvent, ReactNode } from 'react';

// Size configuration with proper typing
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonType = 'button' | 'submit' | 'reset';

const pad: Record<ButtonSize, string> = {
  sm: '0 var(--gx-space-3)',
  md: '0 var(--gx-space-4)',
  lg: '0 var(--gx-space-5)',
};

const height: Record<ButtonSize, number> = {
  sm: 44,
  md: 48,
  lg: 56,
};

const fs: Record<ButtonSize, string> = {
  sm: 'var(--gx-text-body-sm)',
  md: 'var(--gx-text-body)',
  lg: 'var(--gx-text-body-lg)',
};

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  type?: ButtonType;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

export interface SpinnerProps {
  size?: number;
  label?: string;
  className?: string;
  [key: string]: unknown;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  children,
  style,
  ...rest
}: ButtonProps): JSX.Element {
  const onFill = variant === 'primary' || variant === 'danger';

  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    position: 'relative',
    font: `var(--gx-weight-medium) ${fs[size]}/1.3 var(--gx-font-ui)`,
    fontFeatureSettings: 'var(--gx-font-features)',
    minBlockSize: 'var(--gx-target-min)',
    blockSize: `calc(max(var(--gx-target-min), ${height[size]}px * var(--gx-density, 1)))`,
    padding: pad[size],
    borderRadius: 'var(--gx-radius-md)',
    border: '1px solid transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    inlineSize: fullWidth ? '100%' : 'auto',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition:
      'background var(--gx-duration-instant) var(--gx-ease-standard),' +
      'color var(--gx-duration-instant) var(--gx-ease-standard),' +
      'border-color var(--gx-duration-instant) var(--gx-ease-standard)',
    opacity: disabled ? 'var(--gx-disabled-opacity)' : 1,
  };

  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: {
      background: 'var(--gx-accent-solid)',
      color: 'var(--gx-accent-solid-label)',
    },
    secondary: {
      background: 'var(--gx-surface-raised)',
      color: 'var(--gx-text)',
      borderColor: 'var(--gx-hairline)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--gx-text)',
    },
    danger: {
      background: 'var(--gx-danger)',
      color: 'var(--gx-canvas)',
    },
  };

  const classes = ['gx-btn', `gx-btn--${variant}`, onFill && 'gx-on-fill', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={classes}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {loading ? <Spinner size={size === 'lg' ? 18 : 14} /> : iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}

export function Spinner({
  size = 16,
  label = 'Loading',
  className = '',
  ...rest
}: SpinnerProps): JSX.Element {
  const spinnerStyle: CSSProperties = {
    display: 'inline-block',
    inlineSize: size,
    blockSize: size,
    border: 'calc(${size}px * 0.125) solid color-mix(in oklab, currentColor 30%, transparent)',
    borderTopColor: 'currentColor',
    borderRadius: '50%',
    animation: 'gx-spin calc(var(--gx-duration-slow) * 3) linear infinite',
  };

  const classes = ['gx-spinner', className].filter(Boolean).join(' ');

  return (
    <span role="status" aria-label={label} className={classes} style={spinnerStyle} {...rest}>
      <style>{'@keyframes gx-spin{to{transform:rotate(360deg)}}'}</style>
    </span>
  );
}
