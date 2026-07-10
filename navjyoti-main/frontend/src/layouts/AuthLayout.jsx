/**
 * Split-screen auth shell: brand panel (left) + form card (right).
 * Redirects already-authenticated users away from auth pages.
 */
import { Link, Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { useAppSelector } from '@/hooks/redux.js';
import { selectIsAuthenticated, selectRole } from '@/redux/slices/authSlice.js';
import { ROUTES } from '@/constants/routes.js';
import { ROLES } from '@/constants/roles.js';

const highlights = [
  'Approvals in minutes, not weeks',
  'Bank-grade security & encryption',
  'Transparent rates — no hidden fees',
  'Track every application in real time',
];

const AuthLayout = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);

  if (isAuthenticated) {
    const to = role === ROLES.ADMIN || role === ROLES.EMPLOYEE ? ROUTES.ADMIN : ROUTES.DASHBOARD;
    return <Navigate to={to} replace />;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden lg:flex">
        <div className="gradient-brand absolute inset-0 opacity-90" />
        <div className="absolute inset-0 bg-ink-950/40" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to={ROUTES.HOME} className="text-2xl font-extrabold text-white">
            Nav Jyoti
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="max-w-sm text-3xl font-bold leading-snug text-white">
              Capital that keeps your goals moving forward.
            </h2>
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <FiCheckCircle className="shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <p className="text-xs text-white/60">© {new Date().getFullYear()} Nav Jyoti</p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Link to={ROUTES.HOME} className="text-2xl font-extrabold gradient-text">
              Nav Jyoti
            </Link>
          </div>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default AuthLayout;
