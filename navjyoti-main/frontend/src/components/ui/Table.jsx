import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { cn } from '@/utils/cn.js';
import Skeleton from './Skeleton.jsx';
import EmptyState from './EmptyState.jsx';

/**
 * Generic, reusable data table.
 *
 * columns: [{ key, header, render?(row), sortable?, align?, headerClassName?, cellClassName? }]
 * data:    array of row objects
 * sort:    { by, dir } controlled; onSort(key) toggles asc/desc in the parent
 * loading: shows skeleton rows; empty: shows EmptyState when no data
 */
const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' };

const Table = ({
  columns = [],
  data = [],
  rowKey = (row, i) => row._id || row.id || i,
  sort,
  onSort,
  loading = false,
  skeletonRows = 5,
  empty,
  onRowClick,
  className,
}) => {
  const showEmpty = !loading && data.length === 0;

  return (
    <div className={cn('glass overflow-hidden rounded-2xl', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              {columns.map((col) => {
                const isSorted = sort?.by === col.key;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      'px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-400',
                      ALIGN[col.align] || ALIGN.left,
                      col.sortable && 'cursor-pointer select-none hover:text-white',
                      col.headerClassName
                    )}
                    onClick={col.sortable ? () => onSort?.(col.key) : undefined}
                    aria-sort={isSorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="flex flex-col -space-y-1">
                          <FiChevronUp
                            size={11}
                            className={cn(isSorted && sort.dir === 'asc' ? 'text-brand-400' : 'text-slate-600')}
                          />
                          <FiChevronDown
                            size={11}
                            className={cn(isSorted && sort.dir === 'desc' ? 'text-brand-400' : 'text-slate-600')}
                          />
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: skeletonRows }).map((_, r) => (
                  <tr key={`s${r}`} className="border-b border-white/5">
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-4">
                        <Skeleton className="h-4 w-full max-w-[160px]" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((row, i) => (
                  <tr
                    key={rowKey(row, i)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      'border-b border-white/5 transition-colors last:border-0',
                      onRowClick && 'cursor-pointer hover:bg-white/[0.03]'
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn('px-5 py-4 text-slate-200', ALIGN[col.align] || ALIGN.left, col.cellClassName)}
                      >
                        {col.render ? col.render(row, i) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {showEmpty && (empty || <EmptyState title="No records found" />)}
    </div>
  );
};

export default Table;
