import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { Icon } from '../../src/components/core/Icon';

describe('Icon', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with accessibility attributes when decorative vs labelled', () => {
    // 1. Decorative icon
    const { container, unmount } = render(<Icon name="home" />);
    const spanDecorative = container.querySelector('span');
    expect(spanDecorative).toBeInTheDocument();
    expect(spanDecorative).toHaveAttribute('role', 'presentation');
    expect(spanDecorative).toHaveAttribute('aria-hidden', 'true');
    expect(spanDecorative).not.toHaveAttribute('aria-label');
    unmount();

    // 2. Labelled icon
    const { container: containerLabelled } = render(<Icon name="home" label="Home Page" />);
    const spanLabelled = containerLabelled.querySelector('span');
    expect(spanLabelled).toBeInTheDocument();
    expect(spanLabelled).toHaveAttribute('role', 'img');
    expect(spanLabelled).toHaveAttribute('aria-label', 'Home Page');
    expect(spanLabelled).not.toHaveAttribute('aria-hidden');
  });

  it('fetches SVG, caches it, and applies replacement attributes', async () => {
    const mockSvg = '<svg><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>';
    
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve({
        text: () => Promise.resolve(mockSvg),
      } as Response)
    );
    vi.stubGlobal('fetch', fetchMock);

    // 1. First render fetches SVG and displays it with customized stroke-width
    const { container } = render(<Icon name="search" strokeWidth={2.5} />);

    await waitFor(() => {
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('https://unpkg.com/lucide-static@0.469.0/icons/search.svg');

    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '100%');
    expect(svgElement).toHaveAttribute('height', '100%');
    expect(svgElement).toHaveAttribute('stroke-width', '2.5');

    // 2. Second render of the same icon uses cache and does not call fetch again
    const { container: containerCached } = render(<Icon name="search" />);
    
    const svgElementCached = containerCached.querySelector('svg');
    expect(svgElementCached).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
