import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Card from './Card.jsx';
import { useCountUp } from '@/hooks/useCountUp.js';
import { cn } from '@/utils/cn.js';
import { formatNumber } from '@/utils/format.js';

/**
 * Animated statistic tile. Counts up when scrolled into view.
 * `prefix`/`suffix` decorate the value (e.g. ₹, +, Cr, %).
 */
const StatCard = ({ icon: Icon, value, label, prefix = '', suffix = '', decimals = 0, className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useCountUp(value, { start: inView, decimals });

  return (
    <Card ref={ref} variant="glass" hover className={cn('text-center', className)}>
      {Icon && (
        <span className="gradient-brand mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white">
          <Icon size={22} />
        </span>
      )}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        className="text-3xl font-extrabold text-white sm:text-4xl"
      >
        {prefix}
        {formatNumber(count)}
        {suffix}
      </motion.p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </Card>
  );
};

export default StatCard;
