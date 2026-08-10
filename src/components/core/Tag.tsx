import { ReactNode, CSSProperties } from 'react';

interface TagProps {
  onRemove?: () => void;
  removeLabel?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

export function Tag({
  onRemove,
  removeLabel = 'Remove',
  className,
  children,
  style,
  ...rest
}: TagProps): JSX.Element {
  return (
    <span
      className={className || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: '400 var(--gx-text-body-sm)/1.3 var(--gx-font-ui)',
        padding: '5px 10px',
        borderRadius: 'var(--gx-radius-pill)',
        background: 'var(--gx-surface-raised)',
        color: 'var(--gx-text)',
        border: '1px solid var(--gx-hairline)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          className="gx-tag__x"
          aria-label={`${removeLabel}: ${typeof children === 'string' ? children : ''}`}
          onClick={onRemove}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            inlineSize: 16,
            blockSize: 16,
            position: 'relative',
            color: 'var(--gx-text-secondary)',
            borderRadius: 'var(--gx-radius-sm)',
          }}
        >
          <span aria-hidden="true">×</span>
          <span
            style={{
              position: 'absolute',
              inset: '50% auto auto 50%',
              translate: '-50% -50%',
              minInlineSize: 'var(--gx-target-min)',
              minBlockSize: 'var(--gx-target-min)',
            }}
          />
        </button>
      )}
    </span>
  );
}

export type { TagProps };
