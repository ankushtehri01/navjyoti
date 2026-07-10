import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import Container from '@/components/ui/Container.jsx';
import Button from '@/components/ui/Button.jsx';
import { ROUTES } from '@/constants/routes.js';

const CtaSection = () => (
  <section className="py-16">
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-16"
      >
        <div className="gradient-brand absolute inset-0 opacity-90" />
        <div className="absolute inset-0 bg-ink-950/30" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
            The right funding can change what your business does next
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Join thousands who chose a smarter, faster way to finance their ambitions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button as={Link} to={ROUTES.REGISTER} variant="glass" size="lg" rightIcon={<FiArrowRight />}>
              Get Started Free
            </Button>
            <Button as={Link} to={ROUTES.CONTACT} variant="outline" size="lg" className="border-white/40 text-white">
              Talk to an Advisor
            </Button>
          </div>
        </div>
      </motion.div>
    </Container>
  </section>
);

export default CtaSection;
