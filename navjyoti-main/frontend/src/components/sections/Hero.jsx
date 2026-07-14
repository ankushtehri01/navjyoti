import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import Container from '@/components/ui/Container.jsx';
import Button from '@/components/ui/Button.jsx';
import Card from '@/components/ui/Card.jsx';
import { ROUTES } from '@/constants/routes.js';

const points = ['No hidden fees', 'Approval in minutes', '40+ partner banks'];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const Hero = () => (
  <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24">
    {/* ambient glows */}
    <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand-600/20 blur-[120px]" />
    <div className="pointer-events-none absolute top-40 -left-20 h-80 w-80 rounded-full bg-accent-500/15 blur-[120px]" />

    <Container className="relative grid items-center gap-12 lg:grid-cols-2">
      <div>
        <motion.span
          {...fade(0)}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-brand-200"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
          Trusted by 50,000+ customers
        </motion.span>

        <motion.h1 {...fade(0.08)} className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-6xl">
          Capital that keeps your <span className="gradient-text">business moving</span>
        </motion.h1>

        <motion.p {...fade(0.16)} className="mt-6 max-w-xl text-lg text-slate-400">
          Fast, transparent financing for every goal — personal, business, home, and
          beyond. Apply online and get funded without the paperwork maze.
        </motion.p>

        <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-4">
          <Button as={Link} to={ROUTES.GET_FUNDING} size="lg" rightIcon={<FiArrowRight />}>
            Get Funding
          </Button>
          <Button as={Link} to={ROUTES.EMI_CALCULATOR} variant="glass" size="lg">
            Calculate EMI
          </Button>
        </motion.div>

        <motion.ul {...fade(0.32)} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-slate-300">
              <FiCheckCircle className="text-accent-400" /> {p}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Floating summary card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-md"
      >
        <Card variant="strong" padding="lg" className="relative z-10">
          <p className="text-sm text-slate-400">Estimated EMI</p>
          <p className="mt-1 text-4xl font-extrabold text-white">₹22,244<span className="text-lg text-slate-400">/mo</span></p>
          <div className="mt-6 space-y-4">
            {[
              { label: 'Loan Amount', value: '₹10,00,000' },
              { label: 'Interest Rate', value: '8.4% p.a.' },
              { label: 'Tenure', value: '60 months' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{row.label}</span>
                <span className="font-semibold text-white">{row.value}</span>
              </div>
            ))}
          </div>
          <Button as={Link} to={ROUTES.EMI_CALCULATOR} fullWidth className="mt-6">
            Customize Plan
          </Button>
        </Card>
        <div className="gradient-brand absolute -bottom-6 -right-6 h-40 w-40 rounded-3xl opacity-30 blur-2xl" />
      </motion.div>
    </Container>
  </section>
);

export default Hero;
