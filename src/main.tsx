import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from './context/AuthProvider';
import { ModalProvider } from './context/ModalProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GOOGLE_CLIENT_ID } from './lib/constants';
import Layout from '@/routes/Layout';
import SettingsLayout from '@/routes/settings/SettingsLayout';
import Workspace from '@/routes/Workspace';
import UserSettings from '@/routes/settings/UserSettings';
import TeamSettings from '@/routes/settings/TeamSettings';
import TeamWorkspace from '@/routes/TeamWorkspace';
import ErrorPage from '@/routes/ErrorPage';
import Components from '@/routes/Components';
import Auth from '@/routes/Auth';
import ProtectedRoute from '@components/ProtectedRoute';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Components />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/signin',
    element: <Auth />,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/my-workspace',
        element: <Workspace />,
      },
      {
        path: '/workspace/:teamId',
        element: <TeamWorkspace />,
      },
      {
        path: '/',
        element: <SettingsLayout />,
        children: [
          {
            path: '/settings/user/:tab?',
            element: <UserSettings />,
          },
          {
            path: '/settings/team/:tab?',
            element: <TeamSettings />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <AuthProvider>
          <ModalProvider>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <div className="trace-light">
                <div id="modal-container"></div>
                <div id="dropdown-container"></div>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={true}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </div>
            </GoogleOAuthProvider>
          </ModalProvider>
        </AuthProvider>
      </NextUIProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
