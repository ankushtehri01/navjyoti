import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiFile, FiTrash2 } from 'react-icons/fi';
import PageHeader from '@/components/common/PageHeader.jsx';
import StatusBadge from '@/components/common/StatusBadge.jsx';
import { Card, Select, Button, Skeleton, EmptyState } from '@/components/ui';
import { documentService } from '@/services/document.service.js';
import { formatDate } from '@/utils/format.js';

const DOC_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'photo', label: 'Photograph' },
  { value: 'address_proof', label: 'Address Proof' },
  { value: 'salary_slip', label: 'Salary Slip' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'itr', label: 'ITR' },
  { value: 'other', label: 'Other' },
];

const MAX_MB = 5;

const DocumentsPage = () => {
  const qc = useQueryClient();
  const fileRef = useRef(null);
  const [type, setType] = useState('aadhaar');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentService.list(),
    retry: false,
  });
  const items = data?.items ?? [];

  const upload = useMutation({
    mutationFn: documentService.upload,
    onSuccess: () => {
      toast.success('Document uploaded.');
      qc.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: documentService.remove,
    onSuccess: () => {
      toast.success('Document removed.');
      qc.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (e) => toast.error(e.message),
  });

  const onPick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File must be under ${MAX_MB}MB.`);
      return;
    }
    const fd = new FormData();
    fd.append('document', file);
    fd.append('type', type);
    upload.mutate(fd);
  };

  return (
    <>
      <PageHeader title="Documents" subtitle="Upload and manage your KYC and income documents." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload panel */}
        <Card className="lg:col-span-1">
          <h3 className="mb-4 font-semibold text-white">Upload a document</h3>
          <Select
            label="Document type"
            options={DOC_TYPES}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="focus-ring mt-4 flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-8 text-center transition hover:border-brand-500/50 hover:bg-white/[0.04]"
          >
            <FiUploadCloud size={26} className="text-brand-300" />
            <span className="text-sm font-medium text-white">Click to upload</span>
            <span className="text-xs text-slate-500">PDF, JPG, or PNG · up to {MAX_MB}MB</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*,application/pdf" hidden onChange={onPick} />
          {upload.isPending && <p className="mt-3 text-center text-xs text-brand-300">Uploading…</p>}
        </Card>

        {/* List */}
        <div className="lg:col-span-2">
          <h3 className="mb-4 font-semibold text-white">Your documents</h3>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}><Skeleton className="h-6 w-full" /></Card>
              ))}
            </div>
          ) : isError || items.length === 0 ? (
            <Card padding="none">
              <EmptyState icon={FiFile} title="No documents yet" description="Upload your documents to speed up loan approval." />
            </Card>
          ) : (
            <div className="space-y-3">
              {items.map((doc) => (
                <Card key={doc._id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="glass flex h-10 w-10 items-center justify-center rounded-lg text-brand-300">
                      <FiFile size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-medium capitalize text-white">
                        {DOC_TYPES.find((t) => t.value === doc.type)?.label || doc.type}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(doc.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={doc.status} kind="document" />
                    <button
                      type="button"
                      onClick={() => remove.mutate(doc._id)}
                      aria-label="Remove document"
                      className="focus-ring rounded-lg p-2 text-slate-400 hover:text-red-300"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DocumentsPage;
