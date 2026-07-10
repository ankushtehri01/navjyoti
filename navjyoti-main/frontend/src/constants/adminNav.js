/** Admin dashboard sidebar navigation. */
import {
  FiBarChart2, FiUsers, FiUserCheck, FiLayers, FiGrid, FiFileText,
  FiHelpCircle, FiStar, FiMail, FiTag, FiBell, FiSettings,
} from 'react-icons/fi';
import { ROUTES } from './routes.js';

export const ADMIN_NAV = [
  { label: 'Analytics', to: ROUTES.ADMIN, icon: FiBarChart2, end: true },
  { label: 'Applications', to: ROUTES.ADMIN_APPLICATIONS, icon: FiLayers },
  { label: 'Loan Categories', to: ROUTES.ADMIN_LOANS, icon: FiGrid },
  { label: 'Users', to: ROUTES.ADMIN_USERS, icon: FiUsers },
  { label: 'Employees', to: ROUTES.ADMIN_EMPLOYEES, icon: FiUserCheck },
  { label: 'Blogs', to: ROUTES.ADMIN_BLOGS, icon: FiFileText },
  { label: 'FAQs', to: ROUTES.ADMIN_FAQS, icon: FiHelpCircle },
  { label: 'Testimonials', to: ROUTES.ADMIN_TESTIMONIALS, icon: FiStar },
  { label: 'Contacts', to: ROUTES.ADMIN_CONTACTS, icon: FiMail },
  { label: 'Offers', to: ROUTES.ADMIN_OFFERS, icon: FiTag },
  { label: 'Notifications', to: ROUTES.ADMIN_NOTIFICATIONS, icon: FiBell },
  { label: 'Settings', to: ROUTES.ADMIN_SETTINGS, icon: FiSettings },
];
