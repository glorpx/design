import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Code, CodeBlock } from '../../src/components/core/Code';

describe('Code component', () => {
  it('renders inline code with correct styles', () => {
    render(<Code>const x = 5;</Code>);
    const codeEl = screen.getByText('const x = 5;');
    expect(codeEl).toBeInTheDocument();
    expect(codeEl.tagName.toLowerCase()).toBe('code');
    expect(codeEl).toHaveStyle({
      font: '400 0.9em/1.4 var(--gx-font-mono)',
      background: 'var(--gx-surface-raised)',
      border: '1px solid var(--gx-hairline)',
      borderRadius: 'var(--gx-radius-sm)',
      padding: '1px 5px',
    });
  });
});

describe('CodeBlock component', () => {
  const sampleCode = 'const a = 1;\nconsole.log(a);';
  let writeTextMock: Mock;

  beforeEach(() => {
    vi.useFakeTimers();
    writeTextMock = vi.fn().mockImplementation(() => Promise.resolve());
    
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders correctly with language header, pre, and code, and correct styles', () => {
    render(
      <CodeBlock
        code={sampleCode}
        language="javascript"
        copyLabel="Copy Code"
      />
    );

    // Assert language header is rendered and styled
    const langHeader = screen.getByText('javascript');
    expect(langHeader).toBeInTheDocument();
    expect(langHeader).toHaveStyle({
      font: 'var(--gx-weight-medium) var(--gx-text-eyebrow)/1 var(--gx-font-mono)',
      letterSpacing: 'var(--gx-track-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--gx-text-secondary)',
    });

    // Assert copy button is rendered
    const copyBtn = screen.getByRole('button', { name: /Copy Code/i });
    expect(copyBtn).toBeInTheDocument();

    const codeEl = screen.getByText((content) => content.includes('const a = 1'));
    const preEl = codeEl.closest('pre');
    expect(preEl).toBeInTheDocument();
    expect(preEl).toHaveStyle({
      margin: '0px',
      padding: '12px',
      overflowX: 'auto',
      font: '400 var(--gx-text-code)/var(--gx-lh-body) var(--gx-font-mono)',
    });
  });

  it('handles copy action, updates button label, and triggers onCopy callback', async () => {
    const onCopyMock = vi.fn();
    render(
      <CodeBlock
        code={sampleCode}
        language="typescript"
        onCopy={onCopyMock}
        copyLabel="Copy"
      />
    );

    const copyBtn = screen.getByRole('button', { name: 'Copy' });
    expect(copyBtn).toBeInTheDocument();

    // Simulate click
    fireEvent.click(copyBtn);

    // Asserts writeText is called with correct code
    expect(writeTextMock).toHaveBeenCalledWith(sampleCode);

    // Asserts "Copied." label shows up
    expect(screen.getByRole('button')).toHaveTextContent('Copied.');

    // Asserts onCopy callback is executed
    expect(onCopyMock).toHaveBeenCalledWith(sampleCode);

    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(screen.getByRole('button')).toHaveTextContent('Copy');
  });
});
