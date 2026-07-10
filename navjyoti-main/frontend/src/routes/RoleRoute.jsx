/**
 * Role-based guard. Renders children only when the current user's role is
 * in `allowed`; otherwise redirects to the appropriate home for their role.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.js';
import { selectRole, selectIsAuthenticated } from '@/redux/slices/authSlice.js';
import { ROUTES } from '@/constants/routes.js';
import { ROLES } from '@/constants/roles.js';

const RoleRoute = ({ allowed = [] }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  if (!allowed.includes(role)) {
    const fallback =
      role === ROLES.ADMIN || role === ROLES.EMPLOYEE ? ROUTES.ADMIN : ROUTES.DASHBOARD;
    return <Navigate to={fallback} replace />;
  }
  return <Outlet />;
};

export default RoleRoute;
