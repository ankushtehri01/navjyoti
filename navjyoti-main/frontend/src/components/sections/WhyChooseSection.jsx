import { motion } from 'framer-motion';
import Container from '@/components/ui/Container.jsx';
import Card from '@/components/ui/Card.jsx';
import SectionHeading from '@/components/ui/SectionHeading.jsx';
import { WHY_CHOOSE } from '@/constants/site.js';

const WhyChooseSection = () => (
  <section className="py-20">
    <Container>
      <SectionHeading
        eyebrow="Why Nav Jyoti"
        title="Not just a lender — a financial partner"
        subtitle="We combine technology and human expertise to make finance simple, fair, and fast."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
          >
            <Card className="flex h-full gap-4">
              <span className="gradient-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white">
                <item.icon size={20} />
              </span>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Container>
  </section>
);

export default WhyChooseSection;
