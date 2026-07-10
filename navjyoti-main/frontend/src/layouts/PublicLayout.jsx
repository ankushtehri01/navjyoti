/**
 * Public site shell: fixed glass navbar, routed content, and footer.
 * Scrolls to top on route change for a native-app feel.
 */
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar.jsx';
import Footer from '@/components/layout/Footer.jsx';
import FloatingContactWidget from '@/components/layout/FloatingContactWidget.jsx';

const PublicLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <FloatingContactWidget />
    </div>
  );
};

export default PublicLayout;
