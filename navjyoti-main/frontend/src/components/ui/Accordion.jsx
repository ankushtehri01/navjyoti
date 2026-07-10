import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import Card from './Card.jsx';
import { cn } from '@/utils/cn.js';

/**
 * Accessible accordion. `items` = [{ q/title, a/content }]. Single-open by
 * default; pass `allowMultiple` to keep several panels open.
 */
const Accordion = ({ items = [], allowMultiple = false, className }) => {
  const [openSet, setOpenSet] = useState(() => new Set());

  const toggle = (i) => {
    setOpenSet((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, i) => {
        const open = openSet.has(i);
        const title = item.q ?? item.title;
        const content = item.a ?? item.content;
        return (
          <Card key={i} padding="none" variant="glass" className="overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={open}
              className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-white">{title}</span>
              <motion.span animate={{ rotate: open ? 45 : 0 }} className="shrink-0 text-brand-300">
                <FiPlus size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{content}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
};

export default Accordion;
