import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table, TableColumn } from '../../src/components/composite/Table';

describe('Table', () => {
  it('renders columns and rows with correct content', () => {
    const columns: TableColumn[] = [
      { key: 'name', label: 'Name' },
      { key: 'status', label: 'Status' },
    ];

    const rows = [
      { id: '1', name: 'Alice', status: 'Active' },
      { id: '2', name: 'Bob', status: 'Inactive' },
    ];

    render(<Table columns={columns} rows={rows} />);

    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check row data
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getAllByText('Active')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Inactive')[0]).toBeInTheDocument();
  });

  it('renders caption when provided', () => {
    const columns: TableColumn[] = [{ key: 'name', label: 'Name' }];
    const rows = [{ id: '1', name: 'Alice' }];

    render(
      <Table
        columns={columns}
        rows={rows}
        caption="Users Table"
      />
    );

    expect(screen.getByText('Users Table')).toBeInTheDocument();
  });

  it('sets data-align attribute on headers and cells', () => {
    const columns: TableColumn[] = [
      { key: 'name', label: 'Name', align: 'start' },
      { key: 'count', label: 'Count', align: 'end' },
      { key: 'status', label: 'Status', align: 'center' },
    ];

    const rows = [{ id: '1', name: 'Alice', count: '42', status: 'OK' }];

    const { container } = render(<Table columns={columns} rows={rows} />);

    const headers = container.querySelectorAll('th');
    expect(headers[0]).toHaveAttribute('data-align', 'start');
    expect(headers[1]).toHaveAttribute('data-align', 'end');
    expect(headers[2]).toHaveAttribute('data-align', 'center');

    const cells = container.querySelectorAll('td');
    expect(cells[0]).toHaveAttribute('data-align', 'start');
    expect(cells[1]).toHaveAttribute('data-align', 'end');
    expect(cells[2]).toHaveAttribute('data-align', 'center');
  });

  it('applies custom render function to cells', () => {
    const columns: TableColumn[] = [
      { key: 'name', label: 'Name' },
      {
        key: 'doubled',
        label: 'Doubled',
        render: (row) => (row.count as number) * 2,
      },
    ];

    const rows = [
      { id: '1', name: 'Alice', count: 10 },
      { id: '2', name: 'Bob', count: 20 },
    ];

    render(<Table columns={columns} rows={rows} />);

    expect(screen.getByText('20')).toBeInTheDocument(); // 10 * 2
    expect(screen.getByText('40')).toBeInTheDocument(); // 20 * 2
  });

  it('sets data-sticky attribute on headers when stickyHeader is true', () => {
    const columns: TableColumn[] = [{ key: 'name', label: 'Name' }];
    const rows = [{ id: '1', name: 'Alice' }];

    const { container } = render(
      <Table columns={columns} rows={rows} stickyHeader={true} />
    );

    const headers = container.querySelectorAll('th');
    headers.forEach((header) => {
      expect(header).toHaveAttribute('data-sticky', 'true');
    });
  });

  it('sets data-sticky attribute to false on headers when stickyHeader is false', () => {
    const columns: TableColumn[] = [{ key: 'name', label: 'Name' }];
    const rows = [{ id: '1', name: 'Alice' }];

    const { container } = render(
      <Table columns={columns} rows={rows} stickyHeader={false} />
    );

    const headers = container.querySelectorAll('th');
    headers.forEach((header) => {
      expect(header).toHaveAttribute('data-sticky', 'false');
    });
  });

  it('sets data-mono attribute on cells when column.mono is true', () => {
    const columns: TableColumn[] = [
      { key: 'name', label: 'Name' },
      { key: 'ratio', label: 'Ratio', mono: true },
    ];

    const rows = [{ id: '1', name: 'Alice', ratio: '15.54:1' }];

    const { container } = render(<Table columns={columns} rows={rows} />);

    const cells = container.querySelectorAll('td');
    expect(cells[0]).toHaveAttribute('data-mono', 'false');
    expect(cells[1]).toHaveAttribute('data-mono', 'true');
  });

  describe('Uncontrolled Sorting', () => {
    it('sorts rows alphabetically when sortable header is clicked', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const rows = [
        { id: '1', name: 'Charlie' },
        { id: '2', name: 'Alice' },
        { id: '3', name: 'Bob' },
      ];

      render(<Table columns={columns} rows={rows} />);

      const header = screen.getByText('Name');
      fireEvent.click(header);

      // After clicking, should be sorted ascending
      const names = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
      expect(names[0]).toHaveTextContent('Alice');
      expect(names[1]).toHaveTextContent('Bob');
      expect(names[2]).toHaveTextContent('Charlie');
    });

    it('sorts numerically with leading-number awareness', () => {
      const columns: TableColumn[] = [
        { key: 'value', label: 'Value', sortable: true },
      ];

      const rows = [
        { id: '1', value: '15.54' },
        { id: '2', value: '-82.40' },
        { id: '3', value: '0' },
        { id: '4', value: '7.07' },
      ];

      render(<Table columns={columns} rows={rows} />);

      const header = screen.getByText('Value');
      fireEvent.click(header);

      // After clicking, should be sorted: -82.40, 0, 7.07, 15.54
      const values = screen.getAllByText(/^-?[\d.]+$/);
      expect(values[0]).toHaveTextContent('-82.40');
      expect(values[1]).toHaveTextContent('0');
      expect(values[2]).toHaveTextContent('7.07');
      expect(values[3]).toHaveTextContent('15.54');
    });

    it('toggles sort direction on repeated header clicks', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const rows = [
        { id: '1', name: 'Charlie' },
        { id: '2', name: 'Alice' },
        { id: '3', name: 'Bob' },
      ];

      render(<Table columns={columns} rows={rows} />);

      const header = screen.getByText('Name');

      // First click: ascending
      fireEvent.click(header);
      let names = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
      expect(names[0]).toHaveTextContent('Alice');

      // Second click: descending
      fireEvent.click(header);
      names = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
      expect(names[0]).toHaveTextContent('Charlie');

      // Third click: ascending again
      fireEvent.click(header);
      names = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
      expect(names[0]).toHaveTextContent('Alice');
    });

    it('updates aria-sort attribute on sorted column', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'status', label: 'Status' },
      ];

      const rows = [
        { id: '1', name: 'Alice', status: 'Active' },
        { id: '2', name: 'Bob', status: 'Inactive' },
      ];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const headers = container.querySelectorAll('th');
      const nameHeader = headers[0];
      const statusHeader = headers[1];

      // Initially no aria-sort
      expect(nameHeader).not.toHaveAttribute('aria-sort');
      expect(statusHeader).not.toHaveAttribute('aria-sort');

      // Click name header
      fireEvent.click(screen.getByText('Name'));

      // Name header should have ascending, status should not
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      expect(statusHeader).not.toHaveAttribute('aria-sort');

      // Click again for descending
      fireEvent.click(screen.getByText('Name'));
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('displays sort direction indicators (▲, ▼, ↕)', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const rows = [{ id: '1', name: 'Alice' }];

      render(<Table columns={columns} rows={rows} />);

      const header = screen.getByText('Name');

      // Initially should show ↕ (unsorted indicator)
      expect(screen.getByText('↕')).toBeInTheDocument();

      // Click to sort ascending
      fireEvent.click(header);
      expect(screen.getByText('▲')).toBeInTheDocument();
      expect(screen.queryByText('↕')).not.toBeInTheDocument();

      // Click to sort descending
      fireEvent.click(header);
      expect(screen.getByText('▼')).toBeInTheDocument();
      expect(screen.queryByText('▲')).not.toBeInTheDocument();
    });

    it('calls onSort callback when header is clicked', () => {
      const handleSort = vi.fn();
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
      ];

      const rows = [{ id: '1', name: 'Alice', status: 'Active' }];

      render(
        <Table columns={columns} rows={rows} onSort={handleSort} />
      );

      fireEvent.click(screen.getByText('Name'));
      expect(handleSort).toHaveBeenCalledWith('name');

      fireEvent.click(screen.getByText('Status'));
      expect(handleSort).toHaveBeenCalledWith('status');

      expect(handleSort).toHaveBeenCalledTimes(2);
    });

    it('uses custom sortValue when provided', () => {
      const columns: TableColumn[] = [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          sortValue: (row) => (row.name as string).toUpperCase(),
        },
      ];

      const rows = [
        { id: '1', name: 'alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'charlie' },
      ];

      render(<Table columns={columns} rows={rows} />);

      const header = screen.getByText('Name');
      fireEvent.click(header);

      // Should be sorted by uppercase value: ALICE < BOB < CHARLIE
      const names = screen.getAllByText(/^(alice|Bob|charlie)$/);
      expect(names[0]).toHaveTextContent('alice');
      expect(names[1]).toHaveTextContent('Bob');
      expect(names[2]).toHaveTextContent('charlie');
    });
  });

  describe('Controlled Sorting', () => {
    it('respects sortKey and sortDir props when provided', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const rows = [
        { id: '1', name: 'Charlie' },
        { id: '2', name: 'Alice' },
        { id: '3', name: 'Bob' },
      ];

      const { rerender } = render(
        <Table columns={columns} rows={rows} sortKey="name" sortDir="asc" />
      );

      // Should be sorted ascending
      let names = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
      expect(names[0]).toHaveTextContent('Alice');

      // Change to descending
      rerender(
        <Table columns={columns} rows={rows} sortKey="name" sortDir="desc" />
      );

      // Should be sorted descending
      names = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
      expect(names[0]).toHaveTextContent('Charlie');
    });

    it('calls onSort but does not change sort direction with controlled sortKey', () => {
      const handleSort = vi.fn();
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const rows = [
        { id: '1', name: 'Charlie' },
        { id: '2', name: 'Alice' },
        { id: '3', name: 'Bob' },
      ];

      render(
        <Table
          columns={columns}
          rows={rows}
          sortKey="name"
          sortDir="asc"
          onSort={handleSort}
        />
      );

      // Click the header
      fireEvent.click(screen.getByText('Name'));

      // onSort should be called
      expect(handleSort).toHaveBeenCalledWith('name');

      // But sorting should not change (still ascending since it's controlled)
      const names = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
      expect(names[0]).toHaveTextContent('Alice');
    });
  });

  describe('Manual Sort Mode', () => {
    it('does not re-order rows when manualSort is true', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const rows = [
        { id: '1', name: 'Charlie' },
        { id: '2', name: 'Alice' },
        { id: '3', name: 'Bob' },
      ];

      render(
        <Table columns={columns} rows={rows} defaultSortKey="name" manualSort={true} />
      );

      // Rows should still be in original order
      const names = screen.getAllByText(/^(Charlie|Alice|Bob)$/);
      expect(names[0]).toHaveTextContent('Charlie');
      expect(names[1]).toHaveTextContent('Alice');
      expect(names[2]).toHaveTextContent('Bob');
    });

    it('still fires onSort and updates indicator with manualSort', () => {
      const handleSort = vi.fn();
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const rows = [
        { id: '1', name: 'Charlie' },
        { id: '2', name: 'Alice' },
      ];

      render(
        <Table
          columns={columns}
          rows={rows}
          onSort={handleSort}
          manualSort={true}
        />
      );

      fireEvent.click(screen.getByText('Name'));
      expect(handleSort).toHaveBeenCalledWith('name');

      // Indicator should still show ▲ for ascending
      expect(screen.getByText('▲')).toBeInTheDocument();
    });
  });

  describe('Default Sort', () => {
    it('applies defaultSortKey and defaultSortDir on initial render', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const rows = [
        { id: '1', name: 'Charlie' },
        { id: '2', name: 'Alice' },
        { id: '3', name: 'Bob' },
      ];

      render(
        <Table
          columns={columns}
          rows={rows}
          defaultSortKey="name"
          defaultSortDir="asc"
        />
      );

      // Should be sorted ascending by default
      const names = screen.getAllByText(/^(Alice|Bob|Charlie)$/);
      expect(names[0]).toHaveTextContent('Alice');
    });
  });

  describe('Empty and Edge Cases', () => {
    it('renders empty table with no rows', () => {
      const columns: TableColumn[] = [{ key: 'name', label: 'Name' }];

      const { container } = render(<Table columns={columns} rows={[]} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      const tbody = container.querySelector('tbody');
      expect(tbody?.children.length).toBe(0);
    });

    it('handles rows without id by using index', () => {
      const columns: TableColumn[] = [{ key: 'name', label: 'Name' }];
      const rows = [{ name: 'Alice' }, { name: 'Bob' }];

      render(<Table columns={columns} rows={rows} />);

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('handles undefined cell values gracefully', () => {
      const columns: TableColumn[] = [{ key: 'value', label: 'Value' }];
      const rows = [{ id: '1', value: undefined }, { id: '2', value: 'test' }];

      render(<Table columns={columns} rows={rows} />);

      expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('does not render sort button for non-sortable columns', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status', sortable: true },
      ];

      const rows = [{ id: '1', name: 'Alice', status: 'Active' }];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const buttons = container.querySelectorAll('button.gx-tb__sort');
      expect(buttons.length).toBe(1);
      expect(buttons[0]).toHaveTextContent('Status');
    });
  });

  describe('Accessibility', () => {
    it('sets scope attribute on headers', () => {
      const columns: TableColumn[] = [{ key: 'name', label: 'Name' }];
      const rows = [{ id: '1', name: 'Alice' }];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const headers = container.querySelectorAll('th');
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });

    it('hides sort indicator from screen readers with aria-hidden', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true },
      ];

      const rows = [{ id: '1', name: 'Alice' }];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const indicators = container.querySelectorAll('[aria-hidden="true"]');
      expect(indicators.length).toBeGreaterThan(0);
    });

    it('sets data-label on cells for mobile accessibility', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status' },
      ];

      const rows = [{ id: '1', name: 'Alice', status: 'Active' }];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const cells = container.querySelectorAll('td');
      expect(cells[0]).toHaveAttribute('data-label', 'Name');
      expect(cells[1]).toHaveAttribute('data-label', 'Status');
    });
  });

  describe('Props and Styling', () => {
    it('applies custom style prop to wrapper', () => {
      const columns: TableColumn[] = [{ key: 'name', label: 'Name' }];
      const rows = [{ id: '1', name: 'Alice' }];

      const { container } = render(
        <Table
          columns={columns}
          rows={rows}
          style={{ maxWidth: '500px' }}
        />
      );

      const wrapper = container.querySelector('.gx-tb__wrap');
      expect(wrapper).toHaveStyle({ maxWidth: '500px' });
    });

    it('spreads rest props to wrapper', () => {
      const columns: TableColumn[] = [{ key: 'name', label: 'Name' }];
      const rows = [{ id: '1', name: 'Alice' }];

      const { container } = render(
        <Table
          columns={columns}
          rows={rows}
          data-testid="custom-table"
        />
      );

      const wrapper = container.querySelector('[data-testid="custom-table"]');
      expect(wrapper).toBeInTheDocument();
    });
  });
});
