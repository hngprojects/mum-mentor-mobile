// lib/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { RelativePathString, router } from "expo-router";
import { API_BASE_URL, AUTH_ROUTES, AUTH_ROUTES_LIST } from "../constants";
import { auth } from "./auth";

export const apiAuth = (axiosInstance: AxiosInstance) => {
  // Request interceptor - Add token to requests
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await auth.getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Set Content-Type for JSON requests only if not FormData
      if (config.data && !(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle token refresh on 401
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await auth.refreshToken();

          // Retry the original request with new token
          const token = await auth.getAccessToken();
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return axiosInstance.request(originalRequest);
        } catch {
          await auth.clearTokens();

          // Check if we're not already on an auth page
          const currentSegments = router.canGoBack() ? null : "/";
          const isOnAuthPage = AUTH_ROUTES_LIST?.some((route) =>
            currentSegments?.toString().startsWith(route)
          );

          if (!isOnAuthPage) {
            router.replace(AUTH_ROUTES.LOGIN as RelativePathString);
          }

          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Public API - no auth required
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Authenticated API - with auth interceptors
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Apply auth interceptors only to the authenticated instance
apiAuth(authApi);
