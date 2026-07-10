/**
 * Admin shell: reuses the generic dashboard sidebar/topbar with the admin nav.
 * Auth + role gating (admin/employee) is enforced at the router level.
 */
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/layout/DashboardSidebar.jsx';
import DashboardTopbar from '@/components/layout/DashboardTopbar.jsx';
import { ADMIN_NAV } from '@/constants/adminNav.js';
import { useAuth } from '@/hooks/useAuth.js';
import { ROUTES } from '@/constants/routes.js';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <DashboardSidebar nav={ADMIN_NAV} onLogout={handleLogout} />
      <div className="lg:pl-64">
        <DashboardTopbar user={user} onLogout={handleLogout} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
