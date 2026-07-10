import Badge from '@/components/ui/Badge.jsx';
import { APPLICATION_STATUS_META, DOCUMENT_STATUS_META } from '@/constants/status.js';

/**
 * Renders a status pill from a status key. `kind` selects the metadata map.
 */
const MAPS = {
  application: APPLICATION_STATUS_META,
  document: DOCUMENT_STATUS_META,
};

const StatusBadge = ({ status, kind = 'application', size = 'md' }) => {
  const meta = MAPS[kind]?.[status] || { label: status, variant: 'neutral' };
  return (
    <Badge variant={meta.variant} size={size} dot>
      {meta.label}
    </Badge>
  );
};

export default StatusBadge;
