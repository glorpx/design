import React, { useState, CSSProperties, ReactNode } from 'react';

export interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children?: ReactNode | ((active: string) => ReactNode);
  style?: CSSProperties;
}

export function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  children,
  style,
}: TabsProps): JSX.Element {
  const [internal, setInternal] = useState<string>(
    defaultValue ?? (tabs[0]?.value ?? '')
  );

  const active = value !== undefined ? value : internal;

  const set = (v: string): void => {
    setInternal(v);
    onChange?.(v);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const i = tabs.findIndex((t) => t.value === active);
    if (i === -1) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      set(tabs[(i + 1) % tabs.length]!.value);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      set(tabs[(i - 1 + tabs.length) % tabs.length]!.value);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      set(tabs[0]!.value);
    }
    if (e.key === 'End') {
      e.preventDefault();
      set(tabs[tabs.length - 1]!.value);
    }
  };

  return (
    <div style={style}>
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        style={{
          display: 'flex',
          gap: 2,
          borderBlockEnd: '1px solid var(--gx-hairline)',
        }}
      >
        {tabs.map((t) => {
          const on = t.value === active;
          return (
            <button
              key={t.value}
              role="tab"
              type="button"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => set(t.value)}
              className="gx-tab"
              style={{
                all: 'unset',
                cursor: 'pointer',
                position: 'relative',
                padding: '10px 14px',
                minBlockSize: 'var(--gx-target-min)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                font: 'var(--gx-weight-medium) var(--gx-text-label)/1.3 var(--gx-font-ui)',
                color: on ? 'var(--gx-text)' : 'var(--gx-text-secondary)',
                borderRadius: 'var(--gx-radius-sm) var(--gx-radius-sm) 0 0',
                boxShadow: on ? 'inset 0 -2px 0 0 var(--gx-accent-graphic)' : 'none',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        style={{ paddingBlockStart: 'var(--gx-space-4)' }}
      >
        {typeof children === 'function' ? children(active) : children}
      </div>
    </div>
  );
}
