import api from '@/api/config';
import { logout } from '@/api/auth';
import { User } from '@/types/User';
import { useGetUserProfileQuery, userKeys } from '@/hooks/user';
import { useQueryClient } from '@tanstack/react-query';
import { InternalAxiosRequestConfig } from 'axios';
import { createContext, useState, PropsWithChildren, useLayoutEffect, useEffect } from 'react';

export interface AuthContext {
  user?: User | null;
  workspace: { id: string; name: string; path: string; src?: string } | null;
  auth: string | null;
  setAuth: (token: string | null) => void;
  setWorkspace: (workspace: { id: string; name: string; path: string; src?: string }) => void;
  logout: () => void;
  isLoggingOut: boolean;
  isLoading: boolean;
}

type AuthProviderProps = PropsWithChildren & {
  isSignedIn?: boolean;
};

const AuthContext = createContext<AuthContext>({
  user: null,
  workspace: null,
  auth: null,
  setAuth: () => {},
  setWorkspace: () => {},
  logout: () => {},
  isLoggingOut: false,
  isLoading: false,
});

export const myWorkspace = { id: 'my-workspace', name: 'My Workspace', path: 'my-workspace' };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [auth, setAuth] = useState<string | null>(null);
  const { profile, isGetUserProfileLoading } = useGetUserProfileQuery({
    retry: false,
  });

  const [workspace, setWorkspace] = useState<{
    id: string;
    name: string;
    path: string;
    src?: string;
  }>(myWorkspace);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig & { _retry?: boolean }) => {
        config.headers.Authorization =
          !config._retry && auth ? `Bearer ${auth}` : config.headers.Authorization;
        return config;
      }
    );

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [auth]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401) {
          if (err.config.url === '/token/refresh') {
            console.log('Refresh token is no longer valid');
            setAuth(null);
            queryClient.clear();
            if (window.location.pathname !== '/signin') {
              console.log('Redirecting to sign in');
              window.location.href = '/signin';
            }
          } else {
            try {
              console.log('Refreshing token');
              const response = await api.post('/token/refresh');
              setAuth(response.data.access_token);
              originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
              originalRequest._retry = true;
              return api(originalRequest);
            } catch (error) {
              console.log('Token could not be refreshed', error);
              setAuth(null);
            }
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const logoutUser = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      queryClient.clear();
      setAuth(null);
      setIsLoggingOut(false);
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error logging out', error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    }
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        user: profile,
        auth,
        setAuth,
        workspace,
        setWorkspace,
        logout: logoutUser,
        isLoggingOut,
        isLoading: isGetUserProfileLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
