import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiBell, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';
import { ROUTES } from '@/constants/routes.js';
import { useAppDispatch } from '@/hooks/redux.js';
import { toggleSidebar } from '@/redux/slices/uiSlice.js';
import { useOnClickOutside } from '@/hooks/useOnClickOutside.js';
import { cn } from '@/utils/cn.js';

const initials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

const DashboardTopbar = ({ user, onLogout, unreadCount = 0 }) => {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useOnClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-ink-950/70 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Open sidebar"
        className="focus-ring rounded-lg p-2 text-slate-300 hover:text-white lg:hidden"
      >
        <FiMenu size={20} />
      </button>

      <p className="hidden text-sm text-slate-400 sm:block">
        Welcome back, <span className="font-medium text-white">{user?.name?.split(' ')[0]}</span>
      </p>

      <div className="ml-auto flex items-center gap-2">
        <Link
          to={ROUTES.DASHBOARD_NOTIFICATIONS}
          className="focus-ring relative rounded-lg p-2 text-slate-300 hover:text-white"
          aria-label="Notifications"
        >
          <FiBell size={19} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            className="focus-ring flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-white/5"
          >
            <span className="gradient-brand flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                initials(user?.name)
              )}
            </span>
            <FiChevronDown size={15} className={cn('text-slate-400 transition', menuOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="glass-strong absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl p-2 shadow-xl"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                  <p className="truncate text-xs text-slate-400">{user?.email}</p>
                </div>
                <div className="my-1 h-px bg-white/10" />
                <Link
                  to={ROUTES.DASHBOARD_PROFILE}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <FiUser size={16} /> Profile
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-danger/10 hover:text-red-300"
                >
                  <FiLogOut size={16} /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
