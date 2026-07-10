/**
 * Customer dashboard shell: sidebar + topbar + routed content.
 * Auth + role gating is handled at the router level (ProtectedRoute + RoleRoute).
 */
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardSidebar from '@/components/layout/DashboardSidebar.jsx';
import DashboardTopbar from '@/components/layout/DashboardTopbar.jsx';
import { CUSTOMER_NAV } from '@/constants/dashboardNav.js';
import { useAuth } from '@/hooks/useAuth.js';
import { notificationService } from '@/services/notification.service.js';
import { ROUTES } from '@/constants/routes.js';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  // Unread badge — tolerant of the API not being ready yet.
  const { data } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.list({ isRead: false, limit: 1 }),
    retry: false,
    staleTime: 30_000,
  });
  const unreadCount = data?.meta?.total ?? data?.unread ?? 0;

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <DashboardSidebar nav={CUSTOMER_NAV} onLogout={handleLogout} />
      <div className="lg:pl-64">
        <DashboardTopbar user={user} onLogout={handleLogout} unreadCount={unreadCount} />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
