/**
 * Temporary placeholder for public pages not yet built (About, Services, Loan
 * detail pages, calculators, blogs, etc.). Keeps navigation functional and on-brand.
 */
import { Link } from 'react-router-dom';
import { FiTool, FiArrowLeft } from 'react-icons/fi';
import Container from '@/components/ui/Container.jsx';
import Button from '@/components/ui/Button.jsx';
import { ROUTES } from '@/constants/routes.js';

const PlaceholderPage = ({ title = 'Coming soon' }) => (
  <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
    <span className="glass mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-brand-300">
      <FiTool size={26} />
    </span>
    <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
    <p className="mt-4 max-w-md text-slate-400">
      This page is being crafted with the same care as the rest of Nav Jyoti. Check
      back soon — it’s on the way.
    </p>
    <Button as={Link} to={ROUTES.HOME} variant="glass" className="mt-8" leftIcon={<FiArrowLeft />}>
      Back to Home
    </Button>
  </Container>
);

export default PlaceholderPage;
