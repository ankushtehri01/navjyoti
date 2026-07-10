/** Customer dashboard sidebar navigation. */
import {
  FiGrid, FiUser, FiFilePlus, FiLayers, FiUploadCloud, FiBell, FiLifeBuoy,
} from 'react-icons/fi';
import { ROUTES } from './routes.js';

export const CUSTOMER_NAV = [
  { label: 'Overview', to: ROUTES.DASHBOARD, icon: FiGrid, end: true },
  { label: 'Apply for Loan', to: ROUTES.DASHBOARD_APPLY, icon: FiFilePlus },
  { label: 'My Applications', to: ROUTES.DASHBOARD_APPLICATIONS, icon: FiLayers },
  { label: 'Documents', to: ROUTES.DASHBOARD_DOCUMENTS, icon: FiUploadCloud },
  { label: 'Notifications', to: ROUTES.DASHBOARD_NOTIFICATIONS, icon: FiBell },
  { label: 'Profile', to: ROUTES.DASHBOARD_PROFILE, icon: FiUser },
  { label: 'Support', to: ROUTES.DASHBOARD_SUPPORT, icon: FiLifeBuoy },
];
