import { useToast, type ToasterToast } from "@hooks/shadcn/useToast";
import { tokenStorage } from "@utils/token";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
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

type AxiosErrorHandler = (
  error: Error,
  func?: (response: AxiosResponse) => void
) => void;

interface AuthContextValue {
  retryWithRefresh: AxiosInstance;
  retryWithoutRefresh: AxiosInstance;
  handleAxiosError: AxiosErrorHandler;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

axiosRetry(refreshClient, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const status = error.response?.status || 0;
    return axiosRetry.isNetworkError(error) || status >= 500;
  },
});

const controller = new AbortController();
const retryWithRefresh = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  signal: controller.signal,
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
    const status = error.response?.status || 0;
    return axiosRetry.isNetworkError(error) || status >= 500;
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
    const status = error.response?.status || 0;
    return axiosRetry.isNetworkError(error) || status >= 500;
  },
});

const networkErrorToastConfig: Pick<ToasterToast, "description" | "variant"> = {
  description: "Silakan periksa koneksi jaringan Anda dan coba kembali.",
  variant: "destructive",
};

const commonErrorToastConfig: Pick<ToasterToast, "description" | "variant"> = {
  description:
    "Terjadi kesalahan saat memproses permintaan Anda. Silakan coba kembali.",
  variant: "destructive",
};

function AuthProvider({ children }: PropsWithChildren) {
  const { toast } = useToast();

  const handleAxiosError: AxiosErrorHandler = (
    error: Error,
    func?: (response: AxiosResponse) => void
  ) => {
    if (axios.isAxiosError(error)) {
      if (axiosRetry.isNetworkError(error)) {
        toast(networkErrorToastConfig);
        console.error(new Error("network error", { cause: error }));
      } else if (error.response) {
        if (error.response.status === 401) {
          // ignore the error, it's already handled by the refreshAuthLogic function
        } else if (error.response.status >= 500) {
          toast(commonErrorToastConfig);
          console.error(new Error("server error", { cause: error }));
        } else {
          if (func) {
            func(error.response);
          }
        }
      } else {
        toast(commonErrorToastConfig);
        console.error(new Error("unexpected error", { cause: error }));
      }
    } else {
      toast(commonErrorToastConfig);
      console.error(new Error("unexpected error", { cause: error }));
    }
  };

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

        return response;
      } catch (error) {
        controller.abort();
        if (axios.isAxiosError(error)) {
          if (axiosRetry.isNetworkError(error)) {
            toast(networkErrorToastConfig);
            console.error(new Error("network error", { cause: error }));
          } else if (error.response) {
            if (error.response.status === 401) {
              toast({
                description:
                  "Sesi telah berakhir. Anda akan diarahkan ke halaman Beranda dalam 3 detik.",
                variant: "destructive",
              });

              tokenStorage.removeAccessToken();
              tokenStorage.removeRefreshToken();
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            } else if (error.response.status >= 500) {
              toast(commonErrorToastConfig);
              console.error(new Error("server error", { cause: error }));
            } else {
              throw error;
            }
          } else {
            toast(commonErrorToastConfig);
            console.error(new Error("unexpected error", { cause: error }));
          }
        } else {
          toast(commonErrorToastConfig);
          console.error(new Error("unexpected error", { cause: error }));
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
        handleAxiosError,
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
