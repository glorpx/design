import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabItem } from '../../src/components/composite/Tabs';

const mockTabs: TabItem[] = [
  { value: 'tab1', label: 'Tab 1', icon: '📄' },
  { value: 'tab2', label: 'Tab 2', icon: '📊' },
  { value: 'tab3', label: 'Tab 3', icon: '⚙️' },
];

describe('Tabs', () => {
  describe('rendering', () => {
    it('renders all tab headers with labels and icons', () => {
      render(
        <Tabs tabs={mockTabs}>
          <div>Content</div>
        </Tabs>
      );

      const allTabs = screen.getAllByRole('tab');
      expect(allTabs).toHaveLength(3);
      expect(allTabs[0]).toHaveTextContent('Tab 1');
      expect(allTabs[1]).toHaveTextContent('Tab 2');
      expect(allTabs[2]).toHaveTextContent('Tab 3');
    });

    it('renders tab container with tablist role', () => {
      render(
        <Tabs tabs={mockTabs}>
          <div>Content</div>
        </Tabs>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders tabpanel role for content area', () => {
      render(
        <Tabs tabs={mockTabs}>
          <div>Content</div>
        </Tabs>
      );

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('renders each tab button with tab role', () => {
      render(
        <Tabs tabs={mockTabs}>
          <div>Content</div>
        </Tabs>
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });

    it('renders static content in tabpanel', () => {
      render(
        <Tabs tabs={mockTabs}>
          <div>Static Content</div>
        </Tabs>
      );

      expect(screen.getByText('Static Content')).toBeInTheDocument();
    });

    it('renders content from render function', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab2">
          {(active) => <div>Active: {active}</div>}
        </Tabs>
      );

      expect(screen.getByText('Active: tab2')).toBeInTheDocument();
    });

    it('applies custom style prop', () => {
      const { container } = render(
        <Tabs tabs={mockTabs} style={{ backgroundColor: 'red' }}>
          <div>Content</div>
        </Tabs>
      );

      const root = container.firstChild as HTMLElement;
      expect(root.style.backgroundColor).toBe('red');
    });
  });

  describe('uncontrolled state', () => {
    it('defaults to first tab when no defaultValue provided', () => {
      render(
        <Tabs tabs={mockTabs}>
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      expect(screen.getByText('tab1')).toBeInTheDocument();
    });

    it('uses defaultValue when provided', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab2">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      expect(screen.getByText('tab2')).toBeInTheDocument();
    });

    it('updates active tab on click', () => {
      render(
        <Tabs tabs={mockTabs}>
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      const allTabs = screen.getAllByRole('tab');
      const tab2Button = allTabs[1];
      fireEvent.click(tab2Button);

      expect(screen.getByText('tab2')).toBeInTheDocument();
    });
  });

  describe('controlled state', () => {
    it('uses value prop for active tab', () => {
      render(
        <Tabs tabs={mockTabs} value="tab2">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      expect(screen.getByText('tab2')).toBeInTheDocument();
    });

    it('updates when value prop changes', () => {
      const { rerender } = render(
        <Tabs tabs={mockTabs} value="tab1">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      expect(screen.getByText('tab1')).toBeInTheDocument();

      rerender(
        <Tabs tabs={mockTabs} value="tab3">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      expect(screen.getByText('tab3')).toBeInTheDocument();
    });
  });

  describe('onChange callback', () => {
    it('calls onChange when tab is clicked', () => {
      const handleChange = vi.fn();
      render(
        <Tabs tabs={mockTabs} onChange={handleChange}>
          <div>Content</div>
        </Tabs>
      );

      const allTabs = screen.getAllByRole('tab');
      const tab2Button = allTabs[1];
      fireEvent.click(tab2Button);

      expect(handleChange).toHaveBeenCalledWith('tab2');
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls onChange with correct value on keyboard navigation', () => {
      const handleChange = vi.fn();
      render(
        <Tabs tabs={mockTabs} onChange={handleChange}>
          <div>Content</div>
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });

      expect(handleChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('aria attributes', () => {
    it('sets aria-selected="true" on active tab', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab2">
          <div>Content</div>
        </Tabs>
      );

      const allTabs = screen.getAllByRole('tab');
      expect(allTabs[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected="false" on inactive tabs', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab2">
          <div>Content</div>
        </Tabs>
      );

      const allTabs = screen.getAllByRole('tab');
      expect(allTabs[0]).toHaveAttribute('aria-selected', 'false');
      expect(allTabs[2]).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('tabIndex states', () => {
    it('sets tabIndex="0" on active tab', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab2">
          <div>Content</div>
        </Tabs>
      );

      const allTabs = screen.getAllByRole('tab');
      expect(allTabs[1]).toHaveAttribute('tabindex', '0');
    });

    it('sets tabIndex="-1" on inactive tabs', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab2">
          <div>Content</div>
        </Tabs>
      );

      const allTabs = screen.getAllByRole('tab');
      expect(allTabs[0]).toHaveAttribute('tabindex', '-1');
      expect(allTabs[2]).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('keyboard navigation - roving tabindex', () => {
    it('ArrowRight key navigates to next tab', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab1">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });

      expect(screen.getByText('tab2')).toBeInTheDocument();
    });

    it('ArrowRight wraps to first tab from last tab', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab3">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });

      expect(screen.getByText('tab1')).toBeInTheDocument();
    });

    it('ArrowLeft key navigates to previous tab', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab2">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      fireEvent.keyDown(tablist, { key: 'ArrowLeft' });

      expect(screen.getByText('tab1')).toBeInTheDocument();
    });

    it('ArrowLeft wraps to last tab from first tab', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab1">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      fireEvent.keyDown(tablist, { key: 'ArrowLeft' });

      expect(screen.getByText('tab3')).toBeInTheDocument();
    });

    it('Home key navigates to first tab', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab3">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      fireEvent.keyDown(tablist, { key: 'Home' });

      expect(screen.getByText('tab1')).toBeInTheDocument();
    });

    it('End key navigates to last tab', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab1">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      fireEvent.keyDown(tablist, { key: 'End' });

      expect(screen.getByText('tab3')).toBeInTheDocument();
    });

    it('does not navigate on other keys', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab1">
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      const tablist = screen.getByRole('tablist');
      fireEvent.keyDown(tablist, { key: 'Enter' });

      expect(screen.getByText('tab1')).toBeInTheDocument();
    });
  });

  describe('render function children', () => {
    it('passes active tab value to render function', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab2">
          {(active) => <div data-testid="active-value">{active}</div>}
        </Tabs>
      );

      expect(screen.getByTestId('active-value')).toHaveTextContent('tab2');
    });

    it('updates render function output when active tab changes', () => {
      render(
        <Tabs tabs={mockTabs} defaultValue="tab1">
          {(active) => <div data-testid="active-value">{active}</div>}
        </Tabs>
      );

      expect(screen.getByTestId('active-value')).toHaveTextContent('tab1');

      const allTabs = screen.getAllByRole('tab');
      const tab3 = allTabs[2];
      fireEvent.click(tab3);

      expect(screen.getByTestId('active-value')).toHaveTextContent('tab3');
    });
  });

  describe('edge cases', () => {
    it('handles empty tabs array', () => {
      render(
        <Tabs tabs={[]}>
          <div>No tabs</div>
        </Tabs>
      );

      expect(screen.getByText('No tabs')).toBeInTheDocument();
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('handles tabs without icons', () => {
      const tabsWithoutIcons: TabItem[] = [
        { value: 'tab1', label: 'Tab 1' },
        { value: 'tab2', label: 'Tab 2' },
      ];

      render(
        <Tabs tabs={tabsWithoutIcons}>
          <div>Content</div>
        </Tabs>
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
    });

    it('handles single tab', () => {
      const singleTab: TabItem[] = [{ value: 'only', label: 'Only Tab' }];

      render(
        <Tabs tabs={singleTab}>
          {(active) => <div>{active}</div>}
        </Tabs>
      );

      expect(screen.getByText('only')).toBeInTheDocument();
      expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true');
    });

    it('handles undefined onChange gracefully', () => {
      render(
        <Tabs tabs={mockTabs}>
          <div>Content</div>
        </Tabs>
      );

      const allTabs = screen.getAllByRole('tab');
      const tab2 = allTabs[1];
      expect(() => fireEvent.click(tab2)).not.toThrow();
    });

    it('handles ReactNode labels (custom elements)', () => {
      const tabsWithNodeLabels: TabItem[] = [
        { value: 'tab1', label: <span>Custom Label 1</span> },
        { value: 'tab2', label: <strong>Custom Label 2</strong> },
      ];

      render(
        <Tabs tabs={tabsWithNodeLabels}>
          <div>Content</div>
        </Tabs>
      );

      expect(screen.getByText('Custom Label 1')).toBeInTheDocument();
      expect(screen.getByText('Custom Label 2')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies gx-tab class to buttons', () => {
      const { container } = render(
        <Tabs tabs={mockTabs}>
          <div>Content</div>
        </Tabs>
      );

      const buttons = container.querySelectorAll('.gx-tab');
      expect(buttons).toHaveLength(3);
    });

    it('applies style to tab buttons', () => {
      const { container } = render(
        <Tabs tabs={mockTabs} defaultValue="tab1">
          <div>Content</div>
        </Tabs>
      );

      const activeTab = container.querySelector('[aria-selected="true"]') as HTMLElement;
      expect(activeTab?.style.cursor).toBe('pointer');
      expect(activeTab?.style.display).toBe('inline-flex');
    });
  });
});
