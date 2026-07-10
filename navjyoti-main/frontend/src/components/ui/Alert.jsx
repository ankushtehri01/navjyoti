import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { cn } from '@/utils/cn.js';

const CONFIG = {
  info: { icon: FiInfo, cls: 'border-accent-500/30 bg-accent-500/10 text-cyan-100' },
  success: { icon: FiCheckCircle, cls: 'border-success/30 bg-success/10 text-green-100' },
  warning: { icon: FiAlertTriangle, cls: 'border-warning/30 bg-warning/10 text-amber-100' },
  error: { icon: FiXCircle, cls: 'border-danger/30 bg-danger/10 text-red-100' },
};

/** Inline contextual message with icon and optional title. */
const Alert = ({ variant = 'info', title, children, className }) => {
  const { icon: Icon, cls } = CONFIG[variant];
  return (
    <div role="alert" className={cn('flex gap-3 rounded-xl border p-4', cls, className)}>
      <Icon className="mt-0.5 shrink-0" size={18} />
      <div className="text-sm">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && 'mt-1 opacity-90')}>{children}</div>}
      </div>
    </div>
  );
};

export default Alert;
