/**
 * App composition: global providers (Redux, React Query, Toaster) and the
 * router. Suspense provides a graceful fallback while lazy chunks load.
 */
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { store } from '@/redux/store.js';
import { queryClient } from '@/config/queryClient.js';
import { router } from '@/routes/index.jsx';
import AuthProvider from '@/context/AuthProvider.jsx';
import PageLoader from '@/components/common/PageLoader.jsx';

const toastOptions = {
  style: {
    background: 'rgba(17, 26, 46, 0.9)',
    color: '#e2e8f0',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(12px)',
  },
  success: { iconTheme: { primary: '#22c55e', secondary: '#0a1122' } },
  error: { iconTheme: { primary: '#ef4444', secondary: '#0a1122' } },
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
      <Toaster position="top-right" toastOptions={toastOptions} />
    </QueryClientProvider>
  </Provider>
);

export default App;
