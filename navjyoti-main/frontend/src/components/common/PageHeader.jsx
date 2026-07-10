import { cn } from '@/utils/cn.js';

/** Consistent dashboard/admin page header: title + subtitle + optional actions. */
const PageHeader = ({ title, subtitle, actions, className }) => (
  <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
    <div>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
  </div>
);

export default PageHeader;
