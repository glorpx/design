import React, { ReactNode, CSSProperties, useRef, useEffect } from 'react';

/**
 * Modal layer. Traps Tab, closes on Escape and backdrop press, and returns focus to
 * the trigger on close. One of the few places the system allows a shadow.
 */
export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title: ReactNode;
  /** Optional supporting sentence under the title. */
  description?: ReactNode;
  /** Action row, right-aligned. Destructive confirm copy: "you sure? this can't be undone." */
  footer?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  style,
}: DialogProps): JSX.Element | null {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const prev = document.activeElement as HTMLElement | null;
    const node = ref.current;

    // Focus first focusable element
    node
      ?.querySelector<HTMLElement>(
        '[data-gx-autofocus], button, [href], input, select, textarea'
      )
      ?.focus();

    const onKey = (e: KeyboardEvent): void => {
      // Close on Escape
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }

      // Handle Tab trapping
      if (e.key !== 'Tab' || !node) return;

      const focusable = Array.from(
        node.querySelectorAll<HTMLElement>(
          'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !(el as HTMLInputElement | HTMLButtonElement).disabled);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      // Shift+Tab at first element wraps to last
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      }
      // Tab at last element wraps to first
      else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'grid',
        placeItems: 'center',
        background:
          'color-mix(in oklab, var(--gx-text) 42%, transparent)',
        padding: 'var(--gx-space-6)',
      }}
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        style={{
          inlineSize: 'min(520px, 100%)',
          background: 'var(--gx-surface-raised)',
          border: '1px solid var(--gx-hairline)',
          borderRadius: 'var(--gx-radius-lg)',
          boxShadow: 'var(--gx-shadow-overlay)',
          padding: 'var(--gx-space-6)',
          animation:
            'gx-dialog var(--gx-duration-slow) var(--gx-ease-standard)',
          ...style,
        }}
      >
        <style>
          {`@keyframes gx-dialog{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}
        </style>
        <div
          style={{
            font: 'var(--gx-weight-semibold) var(--gx-text-subheading)/1.35 var(--gx-font-display)',
            letterSpacing: '-0.005em',
          }}
        >
          {title}
        </div>
        {description && (
          <p
            style={{
              margin: '8px 0 0',
              font: 'var(--gx-weight-normal, 400) var(--gx-text-body-sm)/var(--gx-lh-body) var(--gx-font-ui)',
              color: 'var(--gx-text-secondary)',
            }}
          >
            {description}
          </p>
        )}
        {children && (
          <div style={{ marginBlockStart: 'var(--gx-space-5)' }}>
            {children}
          </div>
        )}
        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--gx-space-3)',
              marginBlockStart: 'var(--gx-space-6)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
