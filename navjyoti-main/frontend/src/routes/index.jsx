/* eslint-disable react-refresh/only-export-components -- router config exports a non-component */
/**
 * Application router. Routes are lazy-loaded for code-splitting; each element
 * is wrapped in Suspense at the App level. Feature routes are added here as
 * modules are built (dashboard, admin, ...).
 */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.js';
import { ROLES } from '@/constants/roles.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

// Layouts
const PublicLayout = lazy(() => import('@/layouts/PublicLayout.jsx'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout.jsx'));
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout.jsx'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout.jsx'));

// Public
const HomePage = lazy(() => import('@/pages/public/HomePage.jsx'));
const PlaceholderPage = lazy(() => import('@/pages/public/PlaceholderPage.jsx'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage.jsx'));
const FundingWizardPage = lazy(() => import('@/pages/public/FundingWizardPage.jsx'));

// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage.jsx'));

// Customer dashboard
const OverviewPage = lazy(() => import('@/pages/dashboard/OverviewPage.jsx'));
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage.jsx'));
const ApplyLoanPage = lazy(() => import('@/pages/dashboard/ApplyLoanPage.jsx'));
const ApplicationsPage = lazy(() => import('@/pages/dashboard/ApplicationsPage.jsx'));
const DocumentsPage = lazy(() => import('@/pages/dashboard/DocumentsPage.jsx'));
const NotificationsPage = lazy(() => import('@/pages/dashboard/NotificationsPage.jsx'));
const SupportPage = lazy(() => import('@/pages/dashboard/SupportPage.jsx'));

// Admin dashboard
const AdminOverviewPage = lazy(() => import('@/pages/admin/AdminOverviewPage.jsx'));
const AdminApplicationsPage = lazy(() => import('@/pages/admin/AdminApplicationsPage.jsx'));
const AdminLoanCategoriesPage = lazy(() => import('@/pages/admin/AdminLoanCategoriesPage.jsx'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage.jsx'));
const AdminEmployeesPage = lazy(() => import('@/pages/admin/AdminEmployeesPage.jsx'));
const AdminBlogsPage = lazy(() => import('@/pages/admin/AdminBlogsPage.jsx'));
const AdminFaqsPage = lazy(() => import('@/pages/admin/AdminFaqsPage.jsx'));
const AdminTestimonialsPage = lazy(() => import('@/pages/admin/AdminTestimonialsPage.jsx'));
const AdminContactsPage = lazy(() => import('@/pages/admin/AdminContactsPage.jsx'));
const AdminOffersPage = lazy(() => import('@/pages/admin/AdminOffersPage.jsx'));
const AdminNotificationsPage = lazy(() => import('@/pages/admin/AdminNotificationsPage.jsx'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage.jsx'));

// Secondary public pages not yet built — placeholder keeps nav functional.
const stub = (title) => ({ element: <PlaceholderPage title={title} /> });

export const router = createBrowserRouter([
  { path: ROUTES.GET_FUNDING, element: <FundingWizardPage /> },
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.ABOUT, ...stub('About Nav Jyoti') },
      { path: ROUTES.SERVICES, ...stub('Our Services') },
      { path: ROUTES.LOAN_PERSONAL, ...stub('Personal Loan') },
      { path: ROUTES.LOAN_BUSINESS, ...stub('Business Loan') },
      { path: ROUTES.LOAN_HOME, ...stub('Home Loan') },
      { path: ROUTES.LOAN_CAR, ...stub('Car Loan') },
      { path: ROUTES.LOAN_EDUCATION, ...stub('Education Loan') },
      { path: ROUTES.LOAN_GOLD, ...stub('Gold Loan') },
      { path: ROUTES.CREDIT_CARDS, ...stub('Credit Cards') },
      { path: ROUTES.INSURANCE, ...stub('Insurance') },
      { path: ROUTES.INVESTMENTS, ...stub('Investments') },
      { path: ROUTES.EMI_CALCULATOR, ...stub('EMI Calculator') },
      { path: ROUTES.ELIGIBILITY_CALCULATOR, ...stub('Eligibility Calculator') },
      { path: ROUTES.BLOGS, ...stub('Financial Insights') },
      { path: ROUTES.FAQ, ...stub('Frequently Asked Questions') },
      { path: ROUTES.TESTIMONIALS, ...stub('Testimonials') },
      { path: ROUTES.CONTACT, ...stub('Contact Us') },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
    ],
  },
  {
    // Customer dashboard — authenticated + customer role.
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowed={[ROLES.CUSTOMER]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: ROUTES.DASHBOARD, element: <OverviewPage /> },
              { path: ROUTES.DASHBOARD_APPLY, element: <ApplyLoanPage /> },
              { path: ROUTES.DASHBOARD_APPLICATIONS, element: <ApplicationsPage /> },
              { path: ROUTES.DASHBOARD_DOCUMENTS, element: <DocumentsPage /> },
              { path: ROUTES.DASHBOARD_NOTIFICATIONS, element: <NotificationsPage /> },
              { path: ROUTES.DASHBOARD_PROFILE, element: <ProfilePage /> },
              { path: ROUTES.DASHBOARD_SUPPORT, element: <SupportPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    // Admin dashboard — authenticated + admin/employee role.
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowed={[ROLES.ADMIN, ROLES.EMPLOYEE]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: ROUTES.ADMIN, element: <AdminOverviewPage /> },
              { path: ROUTES.ADMIN_APPLICATIONS, element: <AdminApplicationsPage /> },
              { path: ROUTES.ADMIN_LOANS, element: <AdminLoanCategoriesPage /> },
              { path: ROUTES.ADMIN_USERS, element: <AdminUsersPage /> },
              { path: ROUTES.ADMIN_EMPLOYEES, element: <AdminEmployeesPage /> },
              { path: ROUTES.ADMIN_BLOGS, element: <AdminBlogsPage /> },
              { path: ROUTES.ADMIN_FAQS, element: <AdminFaqsPage /> },
              { path: ROUTES.ADMIN_TESTIMONIALS, element: <AdminTestimonialsPage /> },
              { path: ROUTES.ADMIN_CONTACTS, element: <AdminContactsPage /> },
              { path: ROUTES.ADMIN_OFFERS, element: <AdminOffersPage /> },
              { path: ROUTES.ADMIN_NOTIFICATIONS, element: <AdminNotificationsPage /> },
              { path: ROUTES.ADMIN_SETTINGS, element: <AdminSettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);

export default router;
