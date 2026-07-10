/**
 * Bootstraps auth on load: if a token exists, validates it via /auth/me and
 * hydrates the user (axios transparently refreshes an expired access token).
 * Also listens for the global session-expired event to clear Redux state.
 * Renders a loader until bootstrap resolves so guards see settled state.
 */
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service.js';
import { SESSION_EXPIRED_EVENT, getAccessToken } from '@/config/axios.js';
import { useAppDispatch } from '@/hooks/redux.js';
import { setUser, logout } from '@/redux/slices/authSlice.js';
import PageLoader from '@/components/common/PageLoader.jsx';

const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(!getAccessToken());

  useEffect(() => {
    const onExpired = () => dispatch(logout());
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [dispatch]);

  useEffect(() => {
    if (!getAccessToken()) return;
    let active = true;
    (async () => {
      try {
        const { user } = await authService.me();
        if (active) dispatch(setUser(user));
      } catch {
        if (active) dispatch(logout());
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [dispatch]);

  if (!ready) return <PageLoader />;
  return children;
};

export default AuthProvider;
