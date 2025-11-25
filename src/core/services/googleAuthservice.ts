// @ts-nocheck
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "https://api.staging.kaizen.emerj.net";

// This is required for both iOS and Android
const GOOGLE_WEB_CLIENT_ID =
  "177967447276-tsh54rjdsp3dl0u7aho6sg6l38vap45c.apps.googleusercontent.com";

const GOOGLE_IOS_CLIENT_ID =
  "177967447276-9ncqmgbbs4rq2i3r682e91npjss49ir4.apps.googleusercontent.com";
export interface GoogleAuthResult {
  success: boolean;
  user?: {
    email: string;
    name: string;
    photo?: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}
/**
 * Configure Google Sign-In
 * Call this once when your app starts (e.g., in App.tsx or _layout.tsx)
 */
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID, // Required for Android
    iosClientId: GOOGLE_IOS_CLIENT_ID, // Required for iOS
    offlineAccess: true, // Required to get idToken
    scopes: ["profile", "email"], // Optional, these are default
  });

  console.log("✅ Google Sign-In configured");
};
/**
 * Sign in with Google and authenticate with your backend
 */
export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  try {
    console.log("🔐 Starting Google Sign-In...");

    // Check if device has Google Play Services (Android only)
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    console.log("✅ Google Play Services available");

    // Sign in with Google
    const userInfo = await GoogleSignin.signIn();
    console.log("✅ Google Sign-In successful");

    // Check if we got an ID token
    if (!userInfo?.idToken) {
      throw new Error("No ID token received from Google");
    }
    console.log("📤 Authenticating with backend...");

    // Get optional device info
    const deviceId = (await SecureStore.getItemAsync("device_id")) || undefined;
    const deviceName = "Mobile App";
    // Send ID token to YOUR backend
    const response = await fetch(`${API_BASE_URL}/google/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_token: userInfo?.idToken,
        device_id: deviceId,
        device_name: deviceName,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Backend authentication failed:", data);
      throw new Error(data.message || "Backend authentication failed");
    }
    if (data.status === "success" && data.data) {
      console.log("✅ Backend authentication successful");

      const { access_token, refresh_token } = data.data;

      // Store tokens securely
      await SecureStore.setItemAsync("access_token", access_token);
      await SecureStore.setItemAsync("refresh_token", refresh_token);

      // Store device ID if we didn't have one
      if (!deviceId && deviceName) {
        await SecureStore.setItemAsync("device_id", deviceName);
      }

      return {
        success: true,
        user: {
          email: userInfo?.user.email,
          name: userInfo?.user.name || "",
          photo: userInfo?.user.photo || undefined,
        },
        tokens: {
          accessToken: access_token,
          refreshToken: refresh_token,
        },
      };
    }
    throw new Error("Invalid response from backend");
  } catch (error: any) {
    console.error("❌ Google Sign-In Error:", error);

    // Handle specific error cases
    if (error.code === "SIGN_IN_CANCELLED") {
      return {
        success: false,
        error: "Sign-in cancelled by user",
      };
    }

    if (error.code === "IN_PROGRESS") {
      return {
        success: false,
        error: "Sign-in already in progress",
      };
    }

    if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
      return {
        success: false,
        error:
          "Google Play Services not available. Please update Google Play Services.",
      };
    }

    return {
      success: false,
      error: error.message || "Failed to sign in with Google",
    };
  }
};
/**
 * Sign out from Google and clear stored tokens
 */
export const signOutFromGoogle = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log("🚪 Signing out from Google...");

    const refreshToken = await SecureStore.getItemAsync("refresh_token");
    // Revoke session on backend if refresh token exists
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/revoke`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });
        console.log("✅ Session revoked on backend");
      } catch (error) {
        console.warn("⚠️ Failed to revoke session on backend:", error);
        // Continue with local sign out even if backend fails
      }
    }

    // Sign out from Google
    await GoogleSignin.signOut();

    // Clear stored tokens
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    await SecureStore.deleteItemAsync("device_id");

    console.log("✅ Sign-out successful");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Sign-out Error:", error);
    return {
      success: false,
      error: error.message || "Failed to sign out",
    };
  }
};
/**
 * Check if user is currently signed in to Google
 */
export const isSignedInToGoogle = async (): Promise<boolean> => {
  try {
    return await GoogleSignin?.isSignedIn();
  } catch (error) {
    console.log(error);
    return false;
  }
};
/**
 * Check if user is authenticated with your backend
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const accessToken = await SecureStore.getItemAsync("access_token");
    return !!accessToken;
  } catch (error) {
    console.log(error);

    return false;
  }
};
/**
 * Get current user info from Google (if signed in)
 */
export const getCurrentGoogleUser = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    return {
      success: true,
      user: {
        email: userInfo?.user?.email,
        name: userInfo?.user?.name || "",
        photo: userInfo?.user?.photo || undefined,
      },
    };
  } catch (error: any) {
    console.error("❌ Get current user error:", error);
    return {
      success: false,
      error: error.message || "Not signed in",
    };
  }
};
/**
 * Refresh access token using refresh token
 * Call this when you get 401 responses from your backend
 */
export const refreshAccessToken = async (): Promise<{
  success: boolean;
  accessToken?: string;
  error?: string;
}> => {
  try {
    const refreshToken = await SecureStore.getItemAsync("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    console.log("🔄 Refreshing access token...");
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }
    if (data.status === "success" && data.data) {
      const { access_token, refresh_token: newRefreshToken } = data.data;

      // Store new tokens
      await SecureStore.setItemAsync("access_token", access_token);
      await SecureStore.setItemAsync("refresh_token", newRefreshToken);

      console.log("✅ Access token refreshed");
      return { success: true, accessToken: access_token };
    }
    throw new Error("Invalid response from backend");
  } catch (error: any) {
    console.error("❌ Token Refresh Error:", error);
    return {
      success: false,
      error: error.message || "Failed to refresh token",
    };
  }
};
/**
 * Make authenticated API call to your backend
 * Automatically handles token refresh on 401
 */
export const makeAuthenticatedRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    let accessToken = await SecureStore.getItemAsync("access_token");

    if (!accessToken) {
      throw new Error("No access token available. Please sign in.");
    }
    // First attempt
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    // If 401, try refreshing token
    if (response.status === 401) {
      console.log("🔄 Access token expired, refreshing...");

      const refreshResult = await refreshAccessToken();

      if (!refreshResult.success) {
        throw new Error("Session expired. Please sign in again.");
      }
      // Retry request with new token
      accessToken = refreshResult.accessToken!;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }
    return response;
  } catch (error: any) {
    console.error("❌ API Request Error:", error);
    throw error;
  }
};
/**
 * Get current user info from your backend
 */
export const getCurrentUser = async (): Promise<{
  success: boolean;
  user?: any;
  error?: string;
}> => {
  try {
    const response = await makeAuthenticatedRequest("/auth/user");
    const data = await response.json();
    if (data.status === "success" && data.data) {
      return { success: true, user: data.data };
    }
    throw new Error(data.message || "Failed to get user info");
  } catch (error: any) {
    console.error("❌ Get user error:", error);
    return {
      success: false,
      error: error.message || "Failed to get user info",
    };
  }
};
/**
 * Check and handle Google Sign-In status
 * Useful for checking on app startup
 */
export const checkGoogleSignInStatus = async (): Promise<{
  isSignedIn: boolean;
  hasBackendAuth: boolean;
}> => {
  const googleSignedIn = await isSignedInToGoogle();
  const backendAuth = await isAuthenticated();

  return {
    isSignedIn: googleSignedIn,
    hasBackendAuth: backendAuth,
  };
};
