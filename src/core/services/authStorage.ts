import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// --- KEYSTORE CONFIGURATION ---
const AUTH_TOKEN_KEY = "NoraAppAuthToken";

/**
 * Persistently stores the authentication token.
 * Uses SecureStore on native platforms and localStorage on web.
 * @param token The JWT access token string.
 */
export async function setAuthToken(token: string): Promise<void> {
  console.log("=== SET AUTH TOKEN DEBUG ===");
  console.log("Platform:", Platform.OS);
  console.log("Input token length:", token?.length);

  // Validate token
  const trimmedToken = token?.trim();
  if (typeof trimmedToken !== "string" || trimmedToken.length === 0) {
    console.error("AUTH STORAGE: Invalid token received");
    throw new Error("Invalid token: must be a non-empty string");
  }

  try {
    if (Platform.OS === "web") {
      // Use localStorage for web
      localStorage.setItem(AUTH_TOKEN_KEY, trimmedToken);
      console.log("Auth token stored in localStorage (web)");
    } else {
      // Use SecureStore for native (iOS/Android)
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, trimmedToken);
      console.log("Auth token stored in SecureStore (native)");
    }
  } catch (error) {
    console.error("AUTH STORAGE ERROR: Failed to save auth token.", error);
    throw error;
  }
}

/**
 * Retrieves the persistently stored authentication token.
 * @returns The stored token string, or null if not found.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      // Use localStorage for web
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      // ✅ LOG ADDED: Critical check for token retrieval
      console.log("[STORAGE] Web token retrieved:", token ? "YES" : "NO", token ? `Token ID: ${token.substring(0, 10)}...` : "");
      return token;
    } else {
      // Use SecureStore for native
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      // ✅ LOG ADDED: Critical check for token retrieval
      console.log("[STORAGE] Native token retrieved:", token ? "YES" : "NO", token ? `Token ID: ${token.substring(0, 10)}...` : "");
      return token;
    }
  } catch (error) {
    console.error("AUTH STORAGE ERROR: Failed to retrieve token.", error);
    return null;
  }
}

/**
 * Removes the stored authentication token.
 */
export async function removeAuthToken(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      console.log("Auth token removed from localStorage (web)");
    } else {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      console.log("Auth token removed from SecureStore (native)");
    }
  } catch (error) {
    console.error("AUTH STORAGE ERROR: Failed to remove token.", error);
  }
}