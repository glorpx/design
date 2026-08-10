import { CSSProperties, MouseEvent, ReactNode } from 'react';

// Sizing configuration with proper typing
type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'primary' | 'secondary' | 'ghost';

const sizeMap: Record<IconButtonSize, number> = {
  sm: 44,
  md: 48,
  lg: 56,
};

export interface IconButtonProps {
  /** Required accessible name, e.g. "Copy CSS". */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  /** Renders as a toggle with aria-pressed. */
  pressed?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  /** Merged with the component's own state classes. */
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

export function IconButton({
  label,
  variant = 'ghost',
  size: s = 'md',
  disabled = false,
  pressed,
  onClick,
  className = '',
  children,
  style,
  ...rest
}: IconButtonProps): JSX.Element {
  const box = `calc(max(var(--gx-target-min), ${sizeMap[s]}px * var(--gx-density, 1)))`;
  const variants: Record<IconButtonVariant, CSSProperties> = {
    primary: {
      background: 'var(--gx-accent-solid)',
      color: 'var(--gx-accent-solid-label)',
      borderColor: 'transparent',
    },
    secondary: {
      background: 'var(--gx-surface-raised)',
      color: 'var(--gx-text)',
      borderColor: 'var(--gx-hairline)',
    },
    ghost: {
      background: pressed ? 'var(--gx-accent-wash)' : 'transparent',
      color: 'var(--gx-text)',
      borderColor: 'transparent',
    },
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={[
        'gx-btn',
        'gx-iconbtn',
        `gx-btn--${variant}`,
        variant === 'primary' && 'gx-on-fill',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        inlineSize: box,
        blockSize: box,
        minInlineSize: 'var(--gx-target-min)',
        minBlockSize: 'var(--gx-target-min)',
        border: '1px solid transparent',
        borderRadius: 'var(--gx-radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--gx-disabled-opacity)' : 1,
        transition: 'background var(--gx-duration-instant) var(--gx-ease-standard)',
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
