import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Mark } from '../../src/components/core/Mark';

describe('Mark logo', () => {
  it('renders SVG with default attributes', () => {
    const { container } = render(<Mark />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Glorpx');
  });

  it('customizes size and title', () => {
    const { container } = render(<Mark size={64} title="Glorpx Brand" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '64');
    expect(svg).toHaveAttribute('height', '64');
    expect(svg).toHaveAttribute('aria-label', 'Glorpx Brand');
  });

  it('renders void and iris circles under default colored mode', () => {
    const { container } = render(<Mark />);
    const circles = container.querySelectorAll('circle');
    // Default colored mode: 3 circles total (1 in mask, 2 in svg root)
    expect(circles).toHaveLength(3);
    
    // The mask's circle has fill="#000" or similar, let's check roles or position.
    // The void circle is the first circle (rendered inside SVG root).
    const voidCircle = circles[0];
    expect(voidCircle).toHaveAttribute('r', '9');
    expect(voidCircle).toHaveAttribute('fill', 'var(--gx-surface)');
    
    // The iris circle is the third circle.
    const irisCircle = circles[2];
    expect(irisCircle).toHaveAttribute('r', '4.4');
    expect(irisCircle).toHaveAttribute('fill', 'var(--gx-mark-iris)');
  });

  it('hides iris circle if iris prop is false', () => {
    const { container } = render(<Mark iris={false} />);
    const circles = container.querySelectorAll('circle');
    // 2 circles total (1 in mask, 1 in svg root for void)
    expect(circles).toHaveLength(2);
    expect(circles[0]).toHaveAttribute('r', '9');
  });

  it('does not render void/iris circles in svg root and uses currentColor in mono mode', () => {
    const { container } = render(<Mark mono />);
    const circles = container.querySelectorAll('circle');
    // In mono mode, only the mask's circle is rendered (1 circle total)
    expect(circles).toHaveLength(1);
    
    const paths = container.querySelectorAll('path');
    expect(paths).toHaveLength(2); // one for mask, one for blob
    expect(paths[1]).toHaveAttribute('fill', 'currentColor');
  });

  it('customizes void background fill', () => {
    const { container } = render(<Mark void="red" />);
    const circles = container.querySelectorAll('circle');
    // First circle is the void circle in svg root
    expect(circles[0]).toHaveAttribute('fill', 'red');
  });
});
