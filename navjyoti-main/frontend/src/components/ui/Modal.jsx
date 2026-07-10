import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { cn } from '@/utils/cn.js';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll.js';
import { useOnClickOutside } from '@/hooks/useOnClickOutside.js';

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

/**
 * Accessible modal: portaled, animated, Escape-to-close, click-outside-to-close,
 * body-scroll lock, focus moved into the dialog on open.
 */
const Modal = ({ open, onClose, title, size = 'md', children, footer, closeOnOutside = true }) => {
  const panelRef = useRef(null);
  const titleId = useId();

  useLockBodyScroll(open);
  useOnClickOutside(panelRef, () => closeOnOutside && onClose?.(), open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'glass-strong relative z-10 w-full rounded-2xl p-6 shadow-2xl outline-none',
              SIZES[size]
            )}
          >
            {(title || onClose) && (
              <div className="mb-4 flex items-start justify-between gap-4">
                {title && (
                  <h3 id={titleId} className="text-lg font-semibold text-white">
                    {title}
                  </h3>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="focus-ring -mr-1 rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>
            )}
            <div className="text-sm text-slate-300">{children}</div>
            {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
