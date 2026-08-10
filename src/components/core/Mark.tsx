import type { CSSProperties } from 'react';
import React from 'react';

/** Glorpx brand mark: blob + off-center void + iris.
 * The blob is always --gx-mark; the iris is always the active theme accent. */
export interface MarkProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  iris?: boolean;
  void?: string;
  mono?: boolean;
  title?: string;
  style?: CSSProperties;
}

export function Mark({
  size = 48,
  iris = true,
  mono = false,
  void: voidFill = 'var(--gx-surface)',
  title = 'Glorpx',
  style,
  ...rest
}: MarkProps): JSX.Element {
  const id = React.useId().replace(/:/g, '');
  const blobPath =
    'M32 6 C47 6 57 14 57 28 C57 38 60 44 56 50 C51 57 41 58 32 58 C17 58 7 47 7 33 C7 17 18 6 32 6 Z';

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      style={{
        display: 'block',
        ...style,
      }}
      {...rest}
    >
      {!mono && <circle cx="24" cy="27" r="9" fill={voidFill} />}
      <mask
        id={id}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="64"
        height="64"
      >
        <path d={blobPath} fill="#fff" />
        <circle cx="24" cy="27" r="9" fill="#000" />
      </mask>
      <path
        d={blobPath}
        fill={mono ? 'currentColor' : 'var(--gx-mark)'}
        mask={`url(#${id})`}
      />
      {iris && !mono && <circle cx="24" cy="27" r="4.4" fill="var(--gx-mark-iris)" />}
    </svg>
  );
}
