import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn.js';

/**
 * Controlled-or-uncontrolled tab bar with an animated active indicator.
 * `tabs` = [{ value, label, icon? }]. Renders only the tab bar; callers
 * render panels based on the active value (via `value`/`onChange` or `defaultValue`).
 */
const Tabs = ({ tabs = [], value, defaultValue, onChange, className }) => {
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.value);
  const active = value ?? internal;

  const select = (val) => {
    if (value === undefined) setInternal(val);
    onChange?.(val);
  };

  return (
    <div role="tablist" className={cn('glass inline-flex gap-1 rounded-full p-1', className)}>
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => select(tab.value)}
            className={cn(
              'focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
              isActive ? 'text-white' : 'text-slate-400 hover:text-white'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tab-active"
                className="gradient-brand absolute inset-0 -z-10 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="inline-flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
