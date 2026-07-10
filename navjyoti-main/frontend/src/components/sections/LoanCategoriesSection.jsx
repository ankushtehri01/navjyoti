import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import Container from '@/components/ui/Container.jsx';
import Card from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge.jsx';
import SectionHeading from '@/components/ui/SectionHeading.jsx';
import { LOAN_CATEGORIES } from '@/constants/site.js';

const LoanCategoriesSection = () => (
  <section className="py-20">
    <Container>
      <SectionHeading
        eyebrow="Loan Solutions"
        title="Find the right loan for every need"
        subtitle="Competitive rates, flexible tenures, and a fully digital application — pick a category to get started."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LOAN_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
          >
            <Card hover className="group h-full">
              <div className="flex items-start justify-between">
                <span className="gradient-brand flex h-12 w-12 items-center justify-center rounded-xl text-white">
                  <cat.icon size={22} />
                </span>
                <Badge variant="brand">From {cat.rate}</Badge>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{cat.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{cat.desc}</p>
              <Link
                to={cat.to}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 transition group-hover:gap-2.5 group-hover:text-brand-200"
              >
                Learn more <FiArrowRight size={15} />
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </Container>
  </section>
);

export default LoanCategoriesSection;
