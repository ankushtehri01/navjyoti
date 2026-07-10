/**
 * Frontend status metadata (labels + Badge variants), mirroring backend enums.
 */
export const APPLICATION_STATUS_META = {
  draft: { label: 'Draft', variant: 'neutral' },
  submitted: { label: 'Submitted', variant: 'info' },
  under_review: { label: 'Under Review', variant: 'warning' },
  documents_pending: { label: 'Docs Pending', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
  disbursed: { label: 'Disbursed', variant: 'brand' },
};

export const DOCUMENT_STATUS_META = {
  pending: { label: 'Pending', variant: 'warning' },
  verified: { label: 'Verified', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
};

export const EMPLOYMENT_TYPES = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'self_employed', label: 'Self-employed' },
  { value: 'business', label: 'Business owner' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
];
