import { motion } from 'framer-motion';
import Container from '@/components/ui/Container.jsx';
import SectionHeading from '@/components/ui/SectionHeading.jsx';
import { LOAN_PROCESS } from '@/constants/site.js';

const ProcessSection = () => (
  <section className="py-20">
    <Container>
      <SectionHeading
        eyebrow="How It Works"
        title="A clear path to funding"
        subtitle="Four simple steps from application to money in your account."
      />

      <div className="relative mt-14 grid gap-6 md:grid-cols-4">
        {/* connecting line (desktop) */}
        <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
        {LOAN_PROCESS.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="relative text-center"
          >
            <div className="gradient-brand relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg shadow-brand-900/40">
              {s.step}
            </div>
            <h3 className="mt-5 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Container>
  </section>
);

export default ProcessSection;
