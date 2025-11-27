// lib/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RelativePathString, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import {
  ACCESS_TOKEN_KEY,
  API_ENDPOINTS,
  AUTH_ROUTES,
  ONBOARDING_COMPLETE_KEY,
  REDIRECT_AFTER_LOGIN_KEY,
  REFRESH_TOKEN_KEY,
} from "../constants";
import { api } from "./api";

export const auth = {
  // Get access token
  getAccessToken: async () => {
    try {
      if (Platform.OS === "web") {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        return token;
      } else {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        return token;
      }
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  // Get refresh token
  getRefreshToken: async () => {
    try {
      if (Platform.OS === "web") {
        const token = localStorage.getItem(REFRESH_TOKEN_KEY);
        return token;
      } else {
        const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        return token;
      }
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  // Store tokens
  setTokens: async (accessToken: string, refreshToken: string) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        console.log("Auth token stored in localStorage (web)");
      } else {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }

      // Also store onboarding state in AsyncStorage (works on all platforms)
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
    } catch (error) {
      console.error("AUTH STORAGE ERROR: Failed to save auth token.", error);
      throw error;
    }
  },

  // Clear tokens (logout) - FIXED
  clearTokens: async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      }

      // Clear AsyncStorage items
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      await AsyncStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },

  logout: async () => {
    await auth.clearTokens();
    router.replace(AUTH_ROUTES.LOGIN as RelativePathString);
  },

  // Check if user is authenticated - FIXED
  isAuthenticated: async () => {
    const token = await auth.getAccessToken();
    return !!token;
  },

  // Get auth header for API calls - FIXED
  getAuthHeader: async () => {
    const token = await auth.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Set onboarding complete
  setOnboardingComplete: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
    } catch (error) {
      console.error("Error setting onboarding:", error);
    }
  },

  // Clear onboarding cookie
  clearOnboardingComplete: async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
    } catch (error) {
      console.error("Error clearing onboarding:", error);
    }
  },

  // Check if onboarding is complete
  isOnboardingComplete: async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      return value === "true";
    } catch {
      return false;
    }
  },

  // Store current route for redirect after login
  storeRedirectUrl: async (url?: string) => {
    try {
      await AsyncStorage.setItem(REDIRECT_AFTER_LOGIN_KEY, url || "/");
    } catch (error) {
      console.error("Error storing redirect URL:", error);
    }
  },

  // Get and clear redirect URL
  getAndClearRedirectUrl: async () => {
    try {
      const redirectUrl = await AsyncStorage.getItem(REDIRECT_AFTER_LOGIN_KEY);
      if (redirectUrl) {
        await AsyncStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);
        return redirectUrl;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Redirect to login with current URL stored
  redirectToLogin: async (currentRoute?: string) => {
    if (currentRoute) {
      await auth.storeRedirectUrl(currentRoute);
    }
    router.replace(AUTH_ROUTES.LOGIN as RelativePathString);
  },

  // Refresh access token
  refreshToken: async () => {
    const refreshToken = await auth.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN, {
        refresh_token: refreshToken,
      });

      const data = response.data.data;
      const { access_token, refresh_token } = data;

      // Update tokens
      await auth.setTokens(access_token, refresh_token || refreshToken);

      return access_token;
    } catch (error) {
      // Clear invalid tokens
      await auth.clearTokens();
      throw error;
    }
  },
};
