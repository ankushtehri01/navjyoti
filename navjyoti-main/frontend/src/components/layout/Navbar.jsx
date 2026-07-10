import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { NAV_LINKS } from '@/constants/site.js';
import { ROUTES } from '@/constants/routes.js';
import { ROLES } from '@/constants/roles.js';
import { useAppSelector } from '@/hooks/redux.js';
import { selectIsAuthenticated, selectRole } from '@/redux/slices/authSlice.js';
import { useOnClickOutside } from '@/hooks/useOnClickOutside.js';
import Button from '@/components/ui/Button.jsx';
import { cn } from '@/utils/cn.js';

const DesktopDropdown = ({ item }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="focus-ring inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
      >
        {item.label}
        <FiChevronDown size={14} className={cn('transition', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="glass-strong absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl p-2 shadow-xl"
          >
            {item.children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {child.icon && (
                  <span className="gradient-brand flex h-8 w-8 items-center justify-center rounded-lg text-white">
                    <child.icon size={15} />
                  </span>
                )}
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);

  // Close the mobile menu on route change — adjusting state during render
  // (React's recommended pattern) rather than in an effect.
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  const dashboardTo =
    role === ROLES.ADMIN || role === ROLES.EMPLOYEE ? ROUTES.ADMIN : ROUTES.DASHBOARD;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass-strong shadow-lg' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="text-xl font-extrabold text-white">
          Nav<span className="gradient-text">Jyoti</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) =>
            item.children ? (
              <DesktopDropdown key={item.label} item={item} />
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'focus-ring rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                  )
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <Button as={Link} to={dashboardTo} size="sm">
              Dashboard
            </Button>
          ) : (
            <>
              <Button as={Link} to={ROUTES.LOGIN} variant="ghost" size="sm">
                Sign In
              </Button>
              <Button as={Link} to={ROUTES.REGISTER} size="sm">
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="focus-ring rounded-lg p-2 text-white lg:hidden"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="glass-strong overflow-hidden lg:hidden"
          >
            <div className="max-h-[70vh] space-y-1 overflow-y-auto px-4 py-4">
              {NAV_LINKS.map((item) =>
                item.children ? (
                  <div key={item.label} className="py-1">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                      >
                        {child.icon && <child.icon size={16} />}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </NavLink>
                )
              )}
              <div className="grid grid-cols-2 gap-3 pt-3">
                {isAuthenticated ? (
                  <Button as={Link} to={dashboardTo} fullWidth size="sm" className="col-span-2">
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button as={Link} to={ROUTES.LOGIN} variant="glass" fullWidth size="sm">
                      Sign In
                    </Button>
                    <Button as={Link} to={ROUTES.REGISTER} fullWidth size="sm">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
