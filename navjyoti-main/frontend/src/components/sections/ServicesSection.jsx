import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container.jsx';
import Card from '@/components/ui/Card.jsx';
import SectionHeading from '@/components/ui/SectionHeading.jsx';
import { FINANCE_SERVICES } from '@/constants/site.js';

const ServicesSection = () => (
  <section className="py-20">
    <Container>
      <SectionHeading
        eyebrow="Beyond Loans"
        title="A complete financial toolkit"
        subtitle="Everything you need to borrow, protect, and grow — thoughtfully designed and expertly supported."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FINANCE_SERVICES.map((svc, i) => (
          <motion.div
            key={svc.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
          >
            <Link to={svc.to} className="block h-full">
              <Card hover interactive className="h-full">
                <span className="glass flex h-12 w-12 items-center justify-center rounded-xl text-accent-400">
                  <svc.icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{svc.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{svc.desc}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </Container>
  </section>
);

export default ServicesSection;
