import Container from '@/components/ui/Container.jsx';
import SectionHeading from '@/components/ui/SectionHeading.jsx';
import Card from '@/components/ui/Card.jsx';
import { PARTNER_BANKS } from '@/constants/site.js';

const PartnersSection = () => (
  <section className="py-20">
    <Container>
      <SectionHeading
        eyebrow="Our Network"
        title="Backed by 40+ trusted lenders"
        subtitle="We compare offers across leading banks and NBFCs to get you the best deal."
      />

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {PARTNER_BANKS.map((bank) => (
          <Card
            key={bank}
            padding="none"
            className="flex h-20 items-center justify-center px-4 text-center text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            {bank}
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

export default PartnersSection;
