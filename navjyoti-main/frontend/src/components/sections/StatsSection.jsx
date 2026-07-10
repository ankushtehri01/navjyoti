import Container from '@/components/ui/Container.jsx';
import StatCard from '@/components/ui/StatCard.jsx';
import { STATS } from '@/constants/site.js';

const StatsSection = () => (
  <section className="py-16">
    <Container>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatCard
            key={s.label}
            icon={s.icon}
            value={s.value}
            prefix={s.prefix}
            suffix={s.suffix}
            label={s.label}
          />
        ))}
      </div>
    </Container>
  </section>
);

export default StatsSection;
