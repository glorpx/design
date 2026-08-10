import React, { ReactNode, CSSProperties, useMemo, useState } from 'react';

/* Desktop: a normal table. Under 640px each row collapses into a label/value stack —
   same data, none of the horizontal scrolling or crushed columns. */
const TABLE_CSS = `
.gx-tb{inline-size:100%;border-collapse:collapse;font:400 var(--gx-text-body-sm)/1.4 var(--gx-font-ui);font-variant-numeric:tabular-nums}
.gx-tb caption{caption-side:top;text-align:start;padding:10px 12px;font:var(--gx-weight-medium) var(--gx-text-eyebrow)/1.3 var(--gx-font-mono);letter-spacing:var(--gx-track-eyebrow);text-transform:uppercase;color:var(--gx-text-secondary)}
.gx-tb th{text-align:start;padding:0 12px;block-size:calc(40px * var(--gx-density, 1));white-space:nowrap;background:var(--gx-surface-raised);border-block-end:1px solid var(--gx-hairline);font:var(--gx-weight-medium) var(--gx-text-label)/1.3 var(--gx-font-ui)}
.gx-tb th[data-align="end"],.gx-tb td[data-align="end"]{text-align:end}
.gx-tb th[data-align="center"],.gx-tb td[data-align="center"]{text-align:center}
.gx-tb th[data-sticky="true"]{position:sticky;inset-block-start:0;z-index:1}
.gx-tb td{padding:0 12px;block-size:calc(40px * var(--gx-density, 1));border-block-end:1px solid color-mix(in oklab, var(--gx-hairline) 45%, transparent)}
.gx-tb tr:last-child td{border-block-end:0}
.gx-tb td[data-mono="true"]{font-family:var(--gx-font-mono);font-size:var(--gx-text-caption)}
.gx-tb__sort{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;position:relative;color:var(--gx-text-secondary)}
.gx-tb__sort[data-on="true"]{color:var(--gx-text)}
.gx-tb__sort span[data-hit]{position:absolute;inset:50% auto auto 50%;translate:-50% -50%;min-inline-size:var(--gx-target-min);min-block-size:var(--gx-target-min)}
.gx-tb__sort{transition:color var(--gx-duration-instant) var(--gx-ease-standard)}
.gx-tb__sort:hover{color:var(--gx-text)}
.gx-tb tbody tr:hover td{background:var(--gx-hover-ghost)}
.gx-tb__wrap{overflow-x:auto;border:1px solid var(--gx-hairline);border-radius:var(--gx-radius-md);background:var(--gx-surface)}
@media (max-width:640px){
  .gx-tb__wrap{overflow-x:visible}
  .gx-tb thead{position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%)}
  .gx-tb tr{display:grid;gap:4px;padding:10px 12px;border-block-end:1px solid color-mix(in oklab, var(--gx-hairline) 45%, transparent)}
  .gx-tb tr:last-child{border-block-end:0}
  .gx-tb td{display:flex;align-items:baseline;justify-content:space-between;gap:var(--gx-space-4);
    padding:0;block-size:auto;border:0;text-align:end}
  .gx-tb td::before{content:attr(data-label);font:400 var(--gx-text-caption)/1.4 var(--gx-font-mono);
    color:var(--gx-text-secondary);text-align:start}
}
`;

export interface TableColumn {
  key: string;
  label: ReactNode;
  align?: 'start' | 'end' | 'center';
  /** Render the cell in mono at caption size — for tokens, ratios, ids. */
  mono?: boolean;
  sortable?: boolean;
  /** Value used when sorting this column — defaults to `row[key]`. */
  sortValue?: (row: Record<string, unknown>) => string | number;
  render?: (row: Record<string, unknown>) => ReactNode;
}

/**
 * Data table with working sortable headers (aria-sort), optional sticky header and
 * tabular figures. Sorting is number-aware and works with no wiring at all —
 * mark a column `sortable` and the table handles state, order and indicator. Row height follows density; sort controls keep 44px targets.
 * Below 640px each row collapses into a label/value stack instead of scrolling sideways.
 */
export interface TableProps {
  columns: TableColumn[];
  rows: Array<Record<string, unknown>>;
  /** Mono eyebrow caption above the table. */
  caption?: ReactNode;
  /** Controlled sort column. Omit to let the table manage its own sort state. */
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  /** Uncontrolled starting sort. */
  defaultSortKey?: string;
  defaultSortDir?: 'asc' | 'desc';
  /** Notified on every header click. The table still re-orders the rows itself
   *  unless `manualSort` is set. */
  onSort?: (key: string) => void;
  /** The caller sorts (or re-fetches) `rows`; the table only renders the indicator. */
  manualSort?: boolean;
  stickyHeader?: boolean;
  style?: CSSProperties;
}

/** Leading-number aware: "15.54:1" > "7.07:1", "−82.40" < "0". Falls back to locale compare. */
function gxCompare(a: string | number | undefined, b: string | number | undefined): number {
  const extractNumber = (v: string | number | undefined): number => {
    const match = String(v ?? '').replace(/\u2212/g, '-').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  const na = extractNumber(a);
  const nb = extractNumber(b);

  if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) {
    return na - nb;
  }

  return String(a ?? '').localeCompare(String(b ?? ''), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function Table({
  columns = [],
  rows = [],
  caption,
  sortKey,
  sortDir,
  onSort,
  defaultSortKey,
  defaultSortDir = 'asc',
  manualSort = false,
  stickyHeader = false,
  style,
  ...rest
}: TableProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  // Uncontrolled unless the caller passes sortKey. Either way the rows are really
  // sorted here, so a sortable header always does something — set manualSort when
  // the caller sorts (or fetches) the rows itself.
  const [own, setOwn] = useState<{ key?: string; dir: 'asc' | 'desc' }>({
    key: defaultSortKey,
    dir: defaultSortDir,
  });

  const key = sortKey !== undefined ? sortKey : own.key;
  const dir = (sortKey !== undefined ? sortDir : own.dir) || 'asc';

  const handleSort = (k: string): void => {
    if (sortKey === undefined) {
      setOwn((s) => ({
        key: k,
        dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc',
      }));
    }
    if (onSort) onSort(k);
  };

  const col = columns.find((c) => c.key === key);

  const view = useMemo(() => {
    if (manualSort || !key || !col) return rows;
    const get = (r: Record<string, unknown>): string | number | undefined =>
      col.sortValue ? col.sortValue(r) : (r[key] as string | number | undefined);
    return [...rows].sort((a, b) => (dir === 'desc' ? -1 : 1) * gxCompare(get(a), get(b)));
  }, [rows, key, dir, manualSort, col]);

  return (
    <div className="gx-tb__wrap" style={style} {...rest}>
      <style>{TABLE_CSS}</style>
      <table className="gx-tb">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => {
              const sorted = key === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  data-align={c.align || 'start'}
                  data-sticky={stickyHeader ? 'true' : 'false'}
                  aria-sort={sorted ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      className="gx-tb__sort"
                      data-on={sorted ? 'true' : 'false'}
                      onClick={() => handleSort(c.key)}
                    >
                      {c.label}
                      <span aria-hidden="true" style={{ font: '400 10px/1 var(--gx-font-mono)' }}>
                        {sorted ? (dir === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                      <span data-hit="" />
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {view.map((r, i) => (
            <tr key={(r.id as string | number) ?? i}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  data-align={c.align || 'start'}
                  data-mono={c.mono ? 'true' : 'false'}
                  data-label={typeof c.label === 'string' ? c.label : c.key}
                >
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
