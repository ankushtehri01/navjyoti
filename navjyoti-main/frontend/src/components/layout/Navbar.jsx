import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowRight, FiChevronDown, FiMenu, FiMessageSquare, FiX } from 'react-icons/fi';
import { NAV_LINKS } from '@/constants/site.js';
import { ROUTES } from '@/constants/routes.js';
import { ROLES } from '@/constants/roles.js';
import { useAppSelector } from '@/hooks/redux.js';
import { selectIsAuthenticated, selectRole } from '@/redux/slices/authSlice.js';
import { useOnClickOutside } from '@/hooks/useOnClickOutside.js';
import BrandLogo from '@/components/common/BrandLogo.jsx';
import { cn } from '@/utils/cn.js';

const DesktopDropdown = ({ item }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false), open);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      <button
        type="button"
        className="focus-ring inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f7f1e3] hover:text-[#a66b09]"
      >
        {item.label}
        <FiChevronDown size={14} className={cn('transition', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <div className="absolute left-1/2 top-full z-50 mt-3 w-[560px] -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-[#0b2545]/20"
            >
              <div className="grid grid-cols-2 gap-1">
                {item.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className="group flex gap-3 rounded-xl p-3 transition hover:bg-[#fbf6ea]"
                  >
                    {child.icon && (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3fc] text-[#0b2545] transition group-hover:bg-[#f4dfad] group-hover:text-[#a66b09]">
                        <child.icon size={18} />
                      </span>
                    )}
                    <span>
                      <span className="block text-sm font-bold text-[#102846]">{child.label}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-slate-500">{child.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 px-2 pt-3">
                <Link
                  to={ROUTES.EMI_CALCULATOR}
                  className="focus-ring inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-[#102846] transition hover:text-[#a66b09]"
                >
                  <span className="text-[#c88c1d]">₹</span> EMI Calculator
                </Link>
                <Link
                  to={ROUTES.GET_FUNDING}
                  className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#d9a72f] px-4 py-2.5 text-sm font-bold text-[#102846] shadow-md shadow-[#d9a72f]/25 transition hover:bg-[#ebbe4d]"
                >
                  Get Funding <FiArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          </div>
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
        'fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white transition-shadow duration-300',
        scrolled && 'shadow-lg shadow-slate-900/10'
      )}
    >
      <div className="hidden bg-[#0b2545] text-white md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 lg:px-8">
          <p className="flex items-center gap-2 text-xs tracking-wide text-slate-200">
            <FiMessageSquare className="text-[#e1ad38]" size={14} />
            Expert financial advisory &amp; structured funding solutions
          </p>
          <Link
            to={ROUTES.CONTACT}
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-[#d7a42c]/60 px-3 py-1 text-xs font-semibold text-[#f2c85e] transition hover:bg-[#d7a42c] hover:text-[#0b2545]"
          >
            Become a Channel Partner <FiArrowRight size={13} />
          </Link>
        </div>
      </div>

      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 md:h-[76px] lg:px-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5" aria-label="Nav Jyoti home">
          <BrandLogo className="h-14 w-14 rounded-full md:h-16 md:w-16" />
          <span className="hidden border-l border-slate-300 pl-2.5 leading-none sm:block">
            <span className="block font-display text-xl font-extrabold tracking-[0.08em] text-[#0b2545]">NAVJYOTI</span>
            <span className="mt-1 block text-[9px] font-bold tracking-[0.22em] text-[#bd8115]">WEALTH PVT LTD</span>
          </span>
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
                    'focus-ring rounded-lg px-3 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-[#f7eddb] text-[#ae7110]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#0b2545]'
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
            <Link to={dashboardTo} className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Dashboard
            </Link>
          ) : (
            <Link to={ROUTES.LOGIN} className="focus-ring rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Sign In
            </Link>
          )}
          <Link
            to={ROUTES.GET_FUNDING}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#d9a72f] px-4 py-3 text-sm font-bold text-[#102846] shadow-md shadow-[#d9a72f]/25 transition hover:-translate-y-0.5 hover:bg-[#ebbe4d] hover:shadow-lg"
          >
            Get Funding <FiArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="focus-ring rounded-lg p-2 text-[#0b2545] lg:hidden"
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
            className="overflow-hidden border-t border-slate-200 bg-white shadow-xl lg:hidden"
          >
            <div className="max-h-[70vh] space-y-1 overflow-y-auto px-4 py-4">
              {NAV_LINKS.map((item) =>
                item.children ? (
                  <div key={item.label} className="py-1">
                    <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#a66b09]">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#f8f4e9] hover:text-[#0b2545]"
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
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-[#f8f4e9] hover:text-[#0b2545]"
                  >
                    {item.label}
                  </NavLink>
                )
              )}
              <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
                {isAuthenticated ? (
                  <Link to={dashboardTo} className="col-span-2 rounded-lg bg-[#d9a72f] px-4 py-3 text-center text-sm font-bold text-[#102846]">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to={ROUTES.LOGIN} className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-700">
                      Sign In
                    </Link>
                    <Link to={ROUTES.GET_FUNDING} className="rounded-lg bg-[#d9a72f] px-4 py-3 text-center text-sm font-bold text-[#102846]">
                      Get Funding
                    </Link>
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
