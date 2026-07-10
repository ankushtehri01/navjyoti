import { FiInbox } from 'react-icons/fi';
import { cn } from '@/utils/cn.js';

/** Friendly empty placeholder for lists/tables with an optional action. */
const EmptyState = ({ icon: Icon = FiInbox, title = 'Nothing here yet', description, action, className }) => (
  <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
    <span className="glass mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-brand-300">
      <Icon size={24} />
    </span>
    <h3 className="text-base font-semibold text-white">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm text-slate-400">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
