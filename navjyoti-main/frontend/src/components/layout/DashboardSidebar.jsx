import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiLogOut } from 'react-icons/fi';
import { ROUTES } from '@/constants/routes.js';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.js';
import { selectSidebarOpen, setSidebar } from '@/redux/slices/uiSlice.js';
import { cn } from '@/utils/cn.js';

/**
 * Reusable dashboard sidebar. Static on desktop (lg+), slide-over drawer on
 * mobile driven by the ui slice. `nav` = [{ label, to, icon, end }].
 */
const NavItems = ({ nav, onNavigate }) => (
  <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
    {nav.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
            isActive
              ? 'gradient-brand text-white shadow-lg shadow-brand-900/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          )
        }
      >
        <item.icon size={18} />
        {item.label}
      </NavLink>
    ))}
  </nav>
);

const SidebarBody = ({ nav, onLogout, onNavigate, showClose, onClose }) => (
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center justify-between px-5">
      <Link to={ROUTES.HOME} className="text-lg font-extrabold text-white" onClick={onNavigate}>
        Nav<span className="gradient-text">Jyoti</span>
      </Link>
      {showClose && (
        <button type="button" onClick={onClose} aria-label="Close sidebar" className="focus-ring rounded-lg p-1 text-slate-400 hover:text-white lg:hidden">
          <FiX size={20} />
        </button>
      )}
    </div>
    <NavItems nav={nav} onNavigate={onNavigate} />
    <div className="border-t border-white/10 p-3">
      <button
        type="button"
        onClick={onLogout}
        className="focus-ring flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-danger/10 hover:text-red-300"
      >
        <FiLogOut size={18} /> Sign out
      </button>
    </div>
  </div>
);

const DashboardSidebar = ({ nav, onLogout }) => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectSidebarOpen);
  const close = () => dispatch(setSidebar(false));

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/10 bg-ink-950/70 backdrop-blur-xl lg:block">
        <SidebarBody nav={nav} onLogout={onLogout} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={close} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="glass-strong absolute inset-y-0 left-0 w-72"
            >
              <SidebarBody nav={nav} onLogout={onLogout} onNavigate={close} showClose onClose={close} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
