import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/**
 * Animates a number from 0 to `end` over `duration` ms once `start` is true.
 * Uses requestAnimationFrame with an ease-out curve. Respects reduced motion.
 */
export const useCountUp = (end, { duration = 1600, start = true, decimals = 0 } = {}) => {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return undefined;
    startedRef.current = true;

    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    let startTime = null;
    const tick = (now) => {
      // Reduced motion: jump straight to the final value on the first frame
      // (kept out of the effect body to avoid synchronous cascading renders).
      if (prefersReduced) {
        setValue(end);
        return;
      }
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const factor = Number((easeOutCubic(progress)).toFixed(5));
      setValue(Number((end * factor).toFixed(decimals)));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => frameRef.current && cancelAnimationFrame(frameRef.current);
  }, [end, duration, start, decimals]);

  return value;
};

export default useCountUp;
