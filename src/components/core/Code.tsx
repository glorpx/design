import React, { ReactNode, CSSProperties, useState } from 'react';

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  style?: CSSProperties;
}

export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  code: string;
  language?: string;
  onCopy?: (code: string) => void;
  copyLabel?: string;
  style?: CSSProperties;
}

export function Code({ children, style, ...rest }: CodeProps): JSX.Element {
  return (
    <code
      style={{
        font: '400 0.9em/1.4 var(--gx-font-mono)',
        background: 'var(--gx-surface-raised)',
        border: '1px solid var(--gx-hairline)',
        borderRadius: 'var(--gx-radius-sm)',
        padding: '1px 5px',
        ...style,
      }}
      {...rest}
    >
      {children}
    </code>
  );
}

export function CodeBlock({
  code,
  language = 'css',
  onCopy,
  copyLabel = 'Copy',
  style,
  ...rest
}: CodeBlockProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const legacy = () => {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (e) {
        // ignore fallback errors
      }
      document.body.removeChild(ta);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code).catch(legacy);
    } else {
      legacy();
    }

    if (onCopy) {
      onCopy(code);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--gx-surface-raised)',
        border: '1px solid var(--gx-hairline)',
        borderRadius: 'var(--gx-radius-md)',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 8px 6px 12px',
          borderBlockEnd: '1px solid var(--gx-hairline)',
        }}
      >
        <span
          style={{
            font: 'var(--gx-weight-medium) var(--gx-text-eyebrow)/1 var(--gx-font-mono)',
            letterSpacing: 'var(--gx-track-eyebrow)',
            textTransform: 'uppercase',
            color: 'var(--gx-text-secondary)',
          }}
        >
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="gx-copy"
          style={{
            all: 'unset',
            cursor: 'pointer',
            position: 'relative',
            font: 'var(--gx-weight-medium) var(--gx-text-caption)/1 var(--gx-font-ui)',
            color: 'var(--gx-accent-text)',
            padding: '6px 8px',
            borderRadius: 'var(--gx-radius-sm)',
          }}
        >
          {copied ? 'Copied.' : copyLabel}
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
      </div>
      <pre
        style={{
          margin: 0,
          padding: '12px',
          overflowX: 'auto',
          font: '400 var(--gx-text-code)/var(--gx-lh-body) var(--gx-font-mono)',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
