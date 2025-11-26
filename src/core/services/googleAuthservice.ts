// @ts-nocheck
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import { getAuthToken, removeAuthToken, setAuthToken } from "./authStorage";
import { getCurrentUser, UserProfile } from "./userService";

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
  userProfile?: UserProfile; // Backend user profile data
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
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    forceCodeForRefreshToken: true,
    scopes: ["profile", "email", "openid"],
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

    // Get token from correct location (userInfo.data.idToken)
    const idToken = userInfo?.data?.idToken;
    const user = userInfo?.data?.user;

    if (!idToken) {
      throw new Error("No ID token received from Google");
    }

    console.log("📤 Authenticating with backend...");

    // Generate device ID if it doesn't exist
    let deviceId = await SecureStore.getItemAsync("device_id");
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      await SecureStore.setItemAsync("device_id", deviceId);
    }

    const deviceName = "Mobile App";

    console.log("🔧 Request payload:", {
      id_token: idToken.substring(0, 50) + "...",
      device_id: deviceId,
      device_name: deviceName,
    });

    const response = await fetch(`${API_BASE_URL}/api/v1/google/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_token: idToken,
        device_id: deviceId,
        device_name: deviceName,
      }),
    });

    const data = await response.json();
    console.log("📥 Backend response:", data);

    if (!response.ok) {
      console.error("❌ Backend authentication failed:", data);
      throw new Error(data.message || "Backend authentication failed");
    }

    if (data.status === "success" && data.data) {
      console.log("✅ Backend authentication successful");

      const { access_token, refresh_token } = data.data;

      // ✅ FIX: Use standard setAuthToken() to store token in "NoraAppAuthToken" key
      // This ensures the token is stored in the same place as email login
      await setAuthToken(access_token);
      console.log("✅ Token stored using setAuthToken()");

      // Also store refresh_token separately for token refresh functionality
      await SecureStore.setItemAsync("refresh_token", refresh_token);
      console.log("✅ Refresh token stored");

      // ✅ FIX: Fetch user profile from backend after successful authentication
      // This ensures we have complete user data like email login
      console.log("📥 Fetching user profile from backend...");
      const userProfile = await getCurrentUser();

      if (userProfile) {
        console.log("✅ User profile fetched successfully:", userProfile.email);
      } else {
        console.warn("⚠️ Failed to fetch user profile after Google login");
      }

      return {
        success: true,
        user: {
          email: user?.email,
          name: user?.name || "",
          photo: user?.photo || undefined,
        },
        userProfile: userProfile || undefined, // Include backend user profile
        tokens: {
          accessToken: access_token,
          refreshToken: refresh_token,
        },
      };
    }

    throw new Error("Invalid response from backend");
  } catch (error: any) {
    console.error("❌ Google Sign-In Error:", error);

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
      }
    }

    // Sign out from Google
    await GoogleSignin.signOut();

    // ✅ FIX: Use standard removeAuthToken() to clear the auth token
    await removeAuthToken();

    // Clear refresh token and device ID
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
    // ✅ FIX: Use standard getAuthToken() to check for authentication
    const accessToken = await getAuthToken();
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

      // ✅ FIXED: Use centralized setAuthToken for new access token
      await setAuthToken(access_token);
      console.log("✅ Access token refreshed and stored");

      // Store new refresh token
      await SecureStore.setItemAsync("refresh_token", newRefreshToken);

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
    // ✅ FIX: Use standard getAuthToken() to retrieve token
    let accessToken = await getAuthToken();

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
