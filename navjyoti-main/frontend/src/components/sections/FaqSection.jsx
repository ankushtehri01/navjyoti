import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container.jsx';
import SectionHeading from '@/components/ui/SectionHeading.jsx';
import Accordion from '@/components/ui/Accordion.jsx';
import { HOME_FAQS } from '@/constants/site.js';
import { ROUTES } from '@/constants/routes.js';

const FaqSection = () => (
  <section className="py-20">
    <Container size="md">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        subtitle="Everything you need to know before you apply."
      />
      <div className="mt-12">
        <Accordion items={HOME_FAQS} />
      </div>
      <p className="mt-8 text-center text-sm text-slate-400">
        Still have questions?{' '}
        <Link to={ROUTES.CONTACT} className="font-medium text-brand-300 hover:text-brand-200">
          Contact our team
        </Link>
      </p>
    </Container>
  </section>
);

export default FaqSection;
