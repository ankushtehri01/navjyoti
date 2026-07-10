import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import Container from '@/components/ui/Container.jsx';
import Card from '@/components/ui/Card.jsx';
import SectionHeading from '@/components/ui/SectionHeading.jsx';
import { TESTIMONIALS } from '@/constants/site.js';
import { cn } from '@/utils/cn.js';

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <FiStar
        key={i}
        size={15}
        className={cn(i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600')}
      />
    ))}
  </div>
);

const initials = (name) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const TestimonialsSection = () => (
  <section className="py-20">
    <Container>
      <SectionHeading
        eyebrow="Success Stories"
        title="Loved by customers across India"
        subtitle="Real people, real results — here's what our customers say about us."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
          >
            <Card className="flex h-full flex-col">
              <Stars rating={t.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">“{t.message}”</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="gradient-brand flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white">
                  {initials(t.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Container>
  </section>
);

export default TestimonialsSection;
