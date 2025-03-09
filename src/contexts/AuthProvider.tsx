import { useToast } from "@hooks/shadcn/useToast";
import { tokenStorage } from "@utils/token";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import axiosRetry from "axios-retry";
import {
  createContext,
  useContext,
  useLayoutEffect,
  type PropsWithChildren,
} from "react";

interface AuthContextValue {
  retryWithRefresh: AxiosInstance;
  retryWithoutRefresh: AxiosInstance;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

axiosRetry(refreshClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const status = error.response?.status;
    return axiosRetry.isNetworkError(error) || (status || 0) >= 500;
  },
});

const retryWithRefresh = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

retryWithRefresh.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenStorage.getAccessToken();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  }
);

axiosRetry(retryWithRefresh, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const status = error.response?.status;
    return axiosRetry.isNetworkError(error) || (status || 0) >= 500;
  },
});

const retryWithoutRefresh = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  validateStatus: (status) => {
    return status >= 200 && status < 500;
  },
});

axiosRetry(retryWithoutRefresh, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const status = error.response?.status;
    return axiosRetry.isNetworkError(error) || (status || 0) >= 500;
  },
});

function AuthProvider({ children }: PropsWithChildren) {
  const { toast } = useToast();

  useLayoutEffect(() => {
    const refreshAuthLogic = async (failedRequest: AxiosError) => {
      try {
        const refreshToken = tokenStorage.getRefreshToken();
        const response = await refreshClient.get<{
          access_token: string;
          refresh_token: string;
        }>("/auth/refresh", {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        tokenStorage.setAccessToken(response.data.access_token);
        tokenStorage.setRefreshToken(response.data.refresh_token);

        if (failedRequest.response?.config.headers) {
          failedRequest.response.config.headers.Authorization = `Bearer ${response.data.access_token}`;
        }

        return Promise.resolve();
      } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
          toast({
            description:
              "Sesi telah berakhir. Kamu akan diarahkan ke halaman Beranda dalam 3 detik.",
            variant: "destructive",
          });

          setTimeout(() => {
            tokenStorage.removeAccessToken();
            tokenStorage.removeRefreshToken();
            window.location.reload();
          }, 3000);
        } else {
          throw error;
        }
      }
    };

    createAuthRefreshInterceptor(retryWithRefresh, refreshAuthLogic, {
      statusCodes: [401],
      pauseInstanceWhileRefreshing: true,
    });
  }, [toast]);

  return (
    <AuthContext.Provider
      value={{
        retryWithRefresh: retryWithRefresh,
        retryWithoutRefresh: retryWithoutRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const auth = useContext(AuthContext);
  if (auth === undefined) {
    throw new Error(
      `"useAuthContext" must be used within a "AuthContext.Provider"`
    );
  }
  return auth;
}

export { AuthProvider, useAuthContext };
