import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Kbd } from '../../src/components/core/Kbd';

describe('Kbd', () => {
  it('renders kbd element', () => {
    render(<Kbd>Ctrl</Kbd>);
    const kbd = screen.getByText('Ctrl');
    expect(kbd.tagName).toBe('KBD');
    expect(kbd).toBeInTheDocument();
  });

  it('renders with children text', () => {
    render(<Kbd>Enter</Kbd>);
    expect(screen.getByText('Enter')).toBeInTheDocument();
  });

  it('renders with complex children', () => {
    render(
      <Kbd>
        <span>Complex</span>
      </Kbd>
    );
    const kbd = screen.getByText('Complex').closest('kbd');
    expect(kbd).toBeInTheDocument();
  });

  it('applies correct display and layout styles', () => {
    render(<Kbd>A</Kbd>);
    const kbd = screen.getByText('A');
    expect(kbd).toHaveStyle({
      display: 'inline-block',
      minInlineSize: '20px',
      textAlign: 'center',
    });
  });

  it('applies correct typography styles', () => {
    render(<Kbd>Shift</Kbd>);
    const kbd = screen.getByText('Shift');
    expect(kbd).toHaveStyle({
      font: 'var(--gx-weight-medium) 12px/1 var(--gx-font-mono)',
    });
  });

  it('applies correct padding', () => {
    render(<Kbd>Tab</Kbd>);
    const kbd = screen.getByText('Tab');
    expect(kbd).toHaveStyle({
      padding: '4px 6px',
    });
  });

  it('applies correct background and text color', () => {
    render(<Kbd>Cmd</Kbd>);
    const kbd = screen.getByText('Cmd');
    expect(kbd).toHaveStyle({
      background: 'var(--gx-surface-raised)',
      color: 'var(--gx-text)',
    });
  });

  it('applies hairline border with thicker bottom border', () => {
    render(<Kbd>Space</Kbd>);
    const kbd = screen.getByText('Space');
    expect(kbd).toHaveStyle({
      border: '1px solid var(--gx-hairline)',
      borderBottomWidth: '2px',
    });
  });

  it('applies border radius', () => {
    render(<Kbd>Esc</Kbd>);
    const kbd = screen.getByText('Esc');
    expect(kbd).toHaveStyle({
      borderRadius: 'var(--gx-radius-sm)',
    });
  });

  it('supports custom style overrides', () => {
    render(<Kbd style={{ padding: '8px 12px', background: 'custom-color' }}>K</Kbd>);
    const kbd = screen.getByText('K');
    expect(kbd).toHaveStyle({
      padding: '8px 12px',
      background: 'custom-color',
    });
  });

  it('forwards HTML attributes to kbd element', () => {
    render(
      <Kbd className="custom-key" data-testid="test-key">
        F1
      </Kbd>
    );
    const kbd = screen.getByTestId('test-key');
    expect(kbd).toHaveClass('custom-key');
  });

  it('renders without children', () => {
    render(<Kbd />);
    const kbds = screen.queryAllByRole('doc-example'); // kbd has an implicit role
    // Check that at least one kbd element exists
    expect(document.querySelector('kbd')).toBeInTheDocument();
  });

  it('simulates key height with border-bottom', () => {
    render(<Kbd>Q</Kbd>);
    const kbd = screen.getByText('Q');
    const styles = window.getComputedStyle(kbd);
    // The component explicitly sets borderBottomWidth to 2, which simulates key depth
    expect(kbd).toHaveStyle({ borderBottomWidth: '2px' });
  });

  it('supports aria attributes', () => {
    render(<Kbd aria-label="Keyboard key">A</Kbd>);
    const kbd = screen.getByText('A');
    expect(kbd).toHaveAttribute('aria-label', 'Keyboard key');
  });

  it('maintains monospace font family from design tokens', () => {
    render(<Kbd>Code</Kbd>);
    const kbd = screen.getByText('Code');
    expect(kbd).toHaveStyle({
      font: 'var(--gx-weight-medium) 12px/1 var(--gx-font-mono)',
    });
  });
});
