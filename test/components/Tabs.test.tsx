import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Tabs, TabItem } from '../../src/components/composite/Tabs';

const mockTabs: TabItem[] = [
  { value: 'tab1', label: 'Tab 1', icon: <span data-testid="icon-1">📄</span> },
  { value: 'tab2', label: 'Tab 2', icon: <span data-testid="icon-2">📊</span> },
  { value: 'tab3', label: 'Tab 3', icon: <span data-testid="icon-3">⚙️</span> },
];

describe('Tabs', () => {
  it('renders tab list and panel correctly', () => {
    render(
      <Tabs tabs={mockTabs} defaultValue="tab1">
        {(active) => <div data-testid="panel">Active: {active}</div>}
      </Tabs>
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('tabIndex', '0');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('tabIndex', '-1');

    expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    expect(screen.getByText('Tab 1')).toBeInTheDocument();

    const panel = screen.getByTestId('panel');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveTextContent('Active: tab1');
  });

  it('selects tab on click', () => {
    const handleChange = vi.fn();
    render(
      <Tabs tabs={mockTabs} defaultValue="tab1" onChange={handleChange}>
        {(active) => <div data-testid="panel">Active: {active}</div>}
      </Tabs>
    );

    const tab2 = screen.getByRole('tab', { name: /Tab 2/i });
    fireEvent.click(tab2);

    expect(handleChange).toHaveBeenCalledWith('tab2');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('panel')).toHaveTextContent('Active: tab2');
  });

  describe('keyboard navigation', () => {
    it('supports ArrowRight and ArrowLeft loop navigation', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab1">
          {(active) => <div data-testid="panel">Active: {active}</div>}
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      
      // ArrowRight goes to tab2
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });
      expect(screen.getByRole('tab', { name: /Tab 2/i })).toHaveAttribute('aria-selected', 'true');

      // ArrowRight goes to tab3
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });
      expect(screen.getByRole('tab', { name: /Tab 3/i })).toHaveAttribute('aria-selected', 'true');

      // ArrowRight wraps to tab1
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });
      expect(screen.getByRole('tab', { name: /Tab 1/i })).toHaveAttribute('aria-selected', 'true');

      // ArrowLeft wraps to tab3
      fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
      expect(screen.getByRole('tab', { name: /Tab 3/i })).toHaveAttribute('aria-selected', 'true');
    });

    it('supports Home and End key navigation', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab2">
          {(active) => <div data-testid="panel">Active: {active}</div>}
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');

      // End goes to tab3
      fireEvent.keyDown(tablist, { key: 'End' });
      expect(screen.getByRole('tab', { name: /Tab 3/i })).toHaveAttribute('aria-selected', 'true');

      // Home goes to tab1
      fireEvent.keyDown(tablist, { key: 'Home' });
      expect(screen.getByRole('tab', { name: /Tab 1/i })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('controlled mode', () => {
    it('does not change selection internally when controlled and props do not update', () => {
      const handleChange = vi.fn();
      render(
        <Tabs tabs={mockTabs} value="tab1" onChange={handleChange}>
          {(active) => <div data-testid="panel">Active: {active}</div>}
        </Tabs>
      );

      const tab2 = screen.getByRole('tab', { name: /Tab 2/i });
      fireEvent.click(tab2);

      expect(handleChange).toHaveBeenCalledWith('tab2');
      // Active tab is still tab1 because value prop did not change
      expect(screen.getByRole('tab', { name: /Tab 1/i })).toHaveAttribute('aria-selected', 'true');
    });
  });
});
