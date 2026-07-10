import { useLayoutEffect } from 'react';

/**
 * Locks body scroll while `locked` is true (e.g. when a modal is open),
 * preserving the scrollbar gutter to avoid layout shift.
 */
export const useLockBodyScroll = (locked = true) => {
  useLayoutEffect(() => {
    if (!locked) return undefined;
    const { body } = document;
    const original = body.style.overflow;
    const scrollBarGap = window.innerWidth - body.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollBarGap > 0) body.style.paddingRight = `${scrollBarGap}px`;
    return () => {
      body.style.overflow = original;
      body.style.paddingRight = '';
    };
  }, [locked]);
};

export default useLockBodyScroll;
