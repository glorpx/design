import type { CSSProperties } from 'react';
import React from 'react';

const SIZES: Record<'sm' | 'md' | 'lg', number> = {
  sm: 24,
  md: 32,
  lg: 48,
};

/** Identity chip. Falls back to initials when no image is supplied; `name` is the accessible label. */
export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
}

export function Avatar({
  name,
  src,
  size = 'md',
  style,
  ...rest
}: AvatarProps & React.HTMLAttributes<HTMLSpanElement>): JSX.Element {
  // Extract initials from name: split on whitespace, take first 2 words, uppercase first letter
  const initials = (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  const sizePixels = SIZES[size];
  const fontSize = Math.round(sizePixels * 0.4);

  return (
    <span
      role="img"
      aria-label={name}
      style={{
        display: 'grid',
        placeItems: 'center',
        inlineSize: sizePixels,
        blockSize: sizePixels,
        borderRadius: 'var(--gx-radius-pill)',
        overflow: 'hidden',
        background: 'var(--gx-accent-wash)',
        color: 'var(--gx-accent-text)',
        border: '1px solid var(--gx-hairline)',
        font: `var(--gx-weight-medium) ${fontSize}px/1 var(--gx-font-ui)`,
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt=""
          style={{
            inlineSize: '100%',
            blockSize: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        initials
      )}
    </span>
  );
}
