/**
 * Guards routes that require authentication. Redirects unauthenticated
 * users to login, preserving the intended destination for post-login return.
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.js';
import { selectIsAuthenticated } from '@/redux/slices/authSlice.js';
import { ROUTES } from '@/constants/routes.js';

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
