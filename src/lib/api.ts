// lib/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../constants";
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
  // In your apiAuth interceptor, update the request interceptor:
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await auth.getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Only set Content-Type for JSON if not already set and not FormData
      if (config.data && !(config.data instanceof FormData)) {
        if (!config.headers["Content-Type"]) {
          config.headers["Content-Type"] = "application/json";
        }
      } else if (config.data instanceof FormData) {
        // Let the browser/axios set the Content-Type with boundary
        delete config.headers["Content-Type"];
      }

      return config;
    },
    (error) => {
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
