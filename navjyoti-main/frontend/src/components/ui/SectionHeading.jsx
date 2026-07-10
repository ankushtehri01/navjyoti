import { motion } from 'framer-motion';
import { cn } from '@/utils/cn.js';

/**
 * Consistent section header: eyebrow + title (with optional gradient word) +
 * subtitle. Scroll-reveals into view. Use `align` for centered marketing sections.
 */
const SectionHeading = ({ eyebrow, title, subtitle, align = 'center', className }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
    className={cn(
      'max-w-2xl',
      align === 'center' && 'mx-auto text-center',
      align === 'left' && 'text-left',
      className
    )}
  >
    {eyebrow && (
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
    {subtitle && <p className="mt-4 text-base text-slate-400">{subtitle}</p>}
  </motion.div>
);

export default SectionHeading;
