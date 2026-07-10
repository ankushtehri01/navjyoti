/**
 * Home / landing page — composes the marketing sections from the UI library.
 */
import Hero from '@/components/sections/Hero.jsx';
import StatsSection from '@/components/sections/StatsSection.jsx';
import LoanCategoriesSection from '@/components/sections/LoanCategoriesSection.jsx';
import ServicesSection from '@/components/sections/ServicesSection.jsx';
import WhyChooseSection from '@/components/sections/WhyChooseSection.jsx';
import ProcessSection from '@/components/sections/ProcessSection.jsx';
import PartnersSection from '@/components/sections/PartnersSection.jsx';
import TestimonialsSection from '@/components/sections/TestimonialsSection.jsx';
import CtaSection from '@/components/sections/CtaSection.jsx';
import FaqSection from '@/components/sections/FaqSection.jsx';
import ContactSection from '@/components/sections/ContactSection.jsx';

const HomePage = () => (
  <>
    <Hero />
    <StatsSection />
    <LoanCategoriesSection />
    <ServicesSection />
    <WhyChooseSection />
    <ProcessSection />
    <PartnersSection />
    <TestimonialsSection />
    <CtaSection />
    <FaqSection />
    <ContactSection />
  </>
);

export default HomePage;
