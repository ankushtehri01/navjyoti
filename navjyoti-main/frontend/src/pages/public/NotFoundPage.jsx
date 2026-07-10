import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.js';

const NotFoundPage = () => (
  <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <p className="gradient-text text-7xl font-extrabold">404</p>
    <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
    <p className="mt-2 max-w-md text-slate-400">
      The page you’re looking for doesn’t exist or has been moved.
    </p>
    <Link
      to={ROUTES.HOME}
      className="gradient-brand focus-ring mt-8 rounded-full px-6 py-3 text-sm font-semibold text-white"
    >
      Back to Home
    </Link>
  </main>
);

export default NotFoundPage;
