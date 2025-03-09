import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { tokenStorage } from "./token";

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
      tokenStorage.removeAccessToken();
      tokenStorage.removeRefreshToken();
    }

    throw error;
  }
};

createAuthRefreshInterceptor(retryWithRefresh, refreshAuthLogic, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

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

export { retryWithRefresh, retryWithoutRefresh };
