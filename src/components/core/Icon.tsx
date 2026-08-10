import React, { useState, useEffect } from 'react';

/* Lucide (ISC) loaded from the lucide-static CDN and inlined as SVG markup, so the
   stroke inherits currentColor from CSS. (A CSS-mask approach is fragile: sandboxed
   preview frames can block cross-origin mask resources, silently falling back to an
   unmasked solid box.) */
export const GX_ICON_CDN = 'https://unpkg.com/lucide-static@0.469.0/icons/';
const cache: Record<string, string> = {};

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  label,
  style,
  ...rest
}: IconProps) {
  const [svg, setSvg] = useState<string | null>(cache[name] || null);

  useEffect(() => {
    if (cache[name]) {
      setSvg(cache[name]);
      return;
    }
    let alive = true;
    fetch(`${GX_ICON_CDN}${name}.svg`)
      .then((r) => r.text())
      .then((t) => {
        cache[name] = t;
        if (alive) setSvg(t);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [name]);

  const markup = svg
    ? svg.replace('<svg', `<svg width="100%" height="100%" stroke-width="${strokeWidth}"`)
    : null;

  return (
    <span
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      style={{
        display: 'inline-flex',
        inlineSize: size,
        blockSize: size,
        flex: 'none',
        color: 'currentColor',
        ...style,
      }}
      dangerouslySetInnerHTML={markup ? { __html: markup } : undefined}
      {...rest}
    />
  );
}
