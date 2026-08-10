import React, { CSSProperties } from 'react';
import { Mark } from '../core/Mark';
import { Link } from '../core/Link';

const FOOTER_CSS = `
.gx-ft{container-type:inline-size}
.gx-ft__row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--gx-space-4)}
.gx-ft__meta{display:flex;align-items:center;gap:var(--gx-space-5);flex-wrap:wrap}
.gx-ft__cols{display:grid;grid-template-columns:minmax(200px,1fr) repeat(auto-fit,minmax(140px,auto));gap:var(--gx-space-8);align-items:start}
@media (max-width:640px){
  .gx-ft__row{align-items:flex-start;flex-direction:column;gap:var(--gx-space-3)}
  .gx-ft__meta{gap:var(--gx-space-4)}
  .gx-ft__cols{grid-template-columns:1fr;gap:var(--gx-space-6)}
  .gx-ft--pad{padding:var(--gx-space-5)}
  .gx-ft__quote{font-size:var(--gx-text-body)}
  .gx-ft__name{font-size:20px}
}
`;

function FooterStyles(): JSX.Element {
  return <style dangerouslySetInnerHTML={{ __html: FOOTER_CSS }} />;
}

const QUOTE = "If it looks finished, you probably spent too long. But if there's no Glorpx tell, you forgot where it came from.";
const SIGNOFF = 'Build.  /  Deploy.  /  Bye.';

interface LockupProps {
  size?: number;
  type?: number;
}

function Lockup({ size = 34, type = 26 }: LockupProps): JSX.Element {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Mark size={size} />
      <span
        className="gx-ft__name"
        style={{
          font: `var(--gx-weight-medium) ${type}px/1 var(--gx-font-display)`,
          letterSpacing: '-0.01em',
        }}
      >
        Glorpx
      </span>
    </span>
  );
}

interface LinksProps {
  links: FooterLink[];
}

function Links({ links }: LinksProps): JSX.Element | null {
  if (!links || !links.length) return null;
  return (
    <span
      style={{
        display: 'flex',
        gap: 'var(--gx-space-5)',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {links.map((l) => (
        <Link key={l.href + l.label} href={l.href} external={l.external} tone={l.tone || 'ink'}>
          {l.label}
        </Link>
      ))}
    </span>
  );
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  tone?: 'accent' | 'ink';
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  variant?: 'short' | 'long' | 'bar' | 'stack' | 'mono';
  /** One-liner used by short, bar and stack. */
  note?: string;
  /** Quote line for `long`. Defaults to the house quote. */
  quote?: string;
  /** Mono sign-off. Defaults to "Build. / Deploy. / Bye." */
  signoff?: string;
  links?: FooterLink[];
  /** Link columns for `stack`. */
  columns?: FooterColumn[];
  year?: number | string;
  style?: CSSProperties;
}

export function Footer({
  variant = 'short',
  note = 'Made by Glorpx — a playground.',
  quote = QUOTE,
  signoff = SIGNOFF,
  links = [],
  columns = [],
  year = new Date().getFullYear(),
  style,
  ...rest
}: FooterProps & React.HTMLAttributes<HTMLElement>): JSX.Element {
  const shell: CSSProperties = {
    border: '1px solid var(--gx-text)',
    borderRadius: 'var(--gx-radius-lg)',
    padding: 'var(--gx-space-6)',
  };
  const meta: CSSProperties = {
    font: `400 var(--gx-text-caption)/1.4 var(--gx-font-mono)`,
    color: 'var(--gx-text-secondary)',
  };

  if (variant === 'long') {
    return (
      <footer
        className="gx-ft gx-ft--pad"
        style={{ ...shell, padding: 'var(--gx-space-8)', ...style }}
        {...rest}
      >
        <FooterStyles />
        <Lockup />
        <p
          className="gx-ft__quote"
          style={{
            font: `400 var(--gx-text-body-lg)/1.55 var(--gx-font-ui)`,
            margin: 'var(--gx-space-6) 0 0',
            maxInlineSize: '56ch',
          }}
        >
          &ldquo;{quote}&rdquo;
        </p>
        <div
          className="gx-ft__row"
          style={{ marginBlockStart: 'var(--gx-space-8)', ...meta }}
        >
          <span>{signoff}</span>
          <span className="gx-ft__meta">
            <Links links={links} />
            <span>{year}</span>
          </span>
        </div>
      </footer>
    );
  }

  if (variant === 'stack') {
    return (
      <footer
        className="gx-ft gx-ft--pad"
        style={{ ...shell, padding: 'var(--gx-space-8)', ...style }}
        {...rest}
      >
        <FooterStyles />
        <div className="gx-ft__cols">
          <div>
            <Lockup />
            <p
              style={{
                font: `400 var(--gx-text-body-sm)/1.6 var(--gx-font-ui)`,
                color: 'var(--gx-text-secondary)',
                margin: 'var(--gx-space-4) 0 0',
                maxInlineSize: '34ch',
              }}
            >
              {note}
            </p>
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <div
                style={{
                  font: `var(--gx-weight-medium) 11px/1.3 var(--gx-font-mono)`,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--gx-text-secondary)',
                  marginBlockEnd: 10,
                }}
              >
                {c.title}
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {c.links.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    external={l.external}
                    tone="ink"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>
        <div
          className="gx-ft__row"
          style={{
            marginBlockStart: 'var(--gx-space-8)',
            paddingBlockStart: 'var(--gx-space-5)',
            borderBlockStart: '1px solid var(--gx-hairline)',
            ...meta,
          }}
        >
          <span>{signoff}</span>
          <span>{year}</span>
        </div>
      </footer>
    );
  }

  if (variant === 'bar') {
    return (
      <footer
        className="gx-ft gx-ft__row"
        style={{
          padding: 'var(--gx-space-4) var(--gx-space-6)',
          borderBlockStart: '1px solid var(--gx-hairline)',
          ...meta,
          ...style,
        }}
        {...rest}
      >
        <FooterStyles />
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mark size={18} />
          {note}
        </span>
        <span className="gx-ft__meta">
          <Links links={links} />
          <span>{year}</span>
        </span>
      </footer>
    );
  }

  if (variant === 'mono') {
    return (
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          ...meta,
          ...style,
        }}
        {...rest}
      >
        <Mark size={16} />
        <span>{signoff}</span>
        <span aria-hidden="true">·</span>
        <span>{year}</span>
      </footer>
    );
  }

  return (
    <footer
      className="gx-ft gx-ft__row gx-ft--pad"
      style={{ ...shell, ...style }}
      {...rest}
    >
      <FooterStyles />
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          font: `400 var(--gx-text-body)/1.4 var(--gx-font-ui)`,
        }}
      >
        <Mark size={20} />
        {note}
      </span>
      <span className="gx-ft__meta" style={meta}>
        <Links links={links} />
        <span>{year}</span>
      </span>
    </footer>
  );
}
