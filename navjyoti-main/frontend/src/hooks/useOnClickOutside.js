import { useEffect } from 'react';

/**
 * Calls `handler` when a pointer/touch event occurs outside `ref`.
 * Used by dropdowns, popovers, and modals.
 */
export const useOnClickOutside = (ref, handler, enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined;
    const listener = (event) => {
      const el = ref?.current;
      if (!el || el.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
};

export default useOnClickOutside;
