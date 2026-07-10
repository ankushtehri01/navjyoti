/**
 * Config-driven admin CRUD page. Handles list querying (search + filters +
 * pagination), create/edit via a modal-hosted form, confirm-delete, and CSV
 * export — so each entity page is just a config. (DRY across all admin tables.)
 */
import { useMemo, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader.jsx';
import {
  Table, Pagination, Button, Input, Select, Modal, ConfirmDialog,
} from '@/components/ui';
import { useDebounce } from '@/hooks/useDebounce.js';
import { exportToCsv } from '@/utils/csv.js';

const PAGE_SIZE = 10;

const AdminResourcePage = ({
  title,
  subtitle,
  queryKey,
  resource,
  columns,
  searchable = true,
  searchPlaceholder = 'Search…',
  filters = [],
  Form,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  rowActions,
  exportColumns,
  exportName = 'export.csv',
  extraParams,
  headerActions,
}) => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = create, obj = edit
  const [deleteTarget, setDeleteTarget] = useState(null);

  const search = useDebounce(searchInput, 400);

  const params = useMemo(
    () => ({ page, limit: PAGE_SIZE, search: search || undefined, ...filterValues, ...extraParams }),
    [page, search, filterValues, extraParams]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => resource.list(params),
    placeholderData: keepPreviousData,
    retry: false,
  });

  const items = data?.items ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const invalidate = () => qc.invalidateQueries({ queryKey });

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing?._id ? resource.update(editing._id, payload) : resource.create(payload),
    onSuccess: () => {
      toast.success(editing?._id ? 'Updated successfully.' : 'Created successfully.');
      setEditing(undefined);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => resource.remove(id),
    onSuccess: () => {
      toast.success('Deleted successfully.');
      setDeleteTarget(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  // Build the final columns (append an actions column when applicable).
  const showActions = (canEdit && Form) || canDelete || rowActions;
  const actionsColumn = {
    key: '__actions',
    header: '',
    align: 'right',
    render: (row) => (
      <div className="flex items-center justify-end gap-1">
        {rowActions?.(row, { invalidate })}
        {canEdit && Form && (
          <button
            type="button"
            onClick={() => setEditing(row)}
            aria-label="Edit"
            className="focus-ring rounded-lg p-2 text-slate-400 hover:text-white"
          >
            <FiEdit2 size={15} />
          </button>
        )}
        {canDelete && (
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            aria-label="Delete"
            className="focus-ring rounded-lg p-2 text-slate-400 hover:text-red-300"
          >
            <FiTrash2 size={15} />
          </button>
        )}
      </div>
    ),
  };
  const tableColumns = showActions ? [...columns, actionsColumn] : columns;

  const handleExport = () => {
    const cols = exportColumns || columns.filter((c) => c.key !== '__actions');
    exportToCsv(items, cols.map((c) => ({ header: c.header || c.key, key: c.key, accessor: c.exportAccessor })), exportName);
  };

  const setFilter = (key, value) =>
    setFilterValues((prev) => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      setPage(1);
      return next;
    });

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            {headerActions}
            <Button variant="glass" leftIcon={<FiDownload />} onClick={handleExport} disabled={!items.length}>
              Export
            </Button>
            {canCreate && Form && (
              <Button leftIcon={<FiPlus />} onClick={() => setEditing(null)}>
                Add New
              </Button>
            )}
          </>
        }
      />

      {/* Toolbar */}
      {(searchable || filters.length > 0) && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          {searchable && (
            <Input
              leftIcon={<FiSearch size={16} />}
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              containerClassName="sm:max-w-xs"
            />
          )}
          {filters.map((f) => (
            <Select
              key={f.key}
              placeholder={f.placeholder}
              options={[{ value: '', label: f.allLabel || 'All' }, ...f.options]}
              value={filterValues[f.key] || ''}
              onChange={(e) => setFilter(f.key, e.target.value)}
              containerClassName="sm:max-w-[200px]"
            />
          ))}
        </div>
      )}

      <Table columns={tableColumns} data={items} loading={isLoading} />

      {!isError && totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}

      {/* Create / edit modal */}
      {Form && (
        <Modal
          open={editing !== undefined}
          onClose={() => setEditing(undefined)}
          title={editing?._id ? `Edit ${title}` : `Add ${title}`}
          size="lg"
        >
          <Form
            key={editing?._id || 'new'}
            initialValues={editing || {}}
            submitting={saveMutation.isPending}
            onSubmit={(payload) => saveMutation.mutate(payload)}
            onCancel={() => setEditing(undefined)}
          />
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        title="Delete record"
        description="This action is permanent and cannot be undone."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </>
  );
};

export default AdminResourcePage;
