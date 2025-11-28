import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "https://api.staging.kaizen.emerj.net";

export interface AppleAuthResult {
  success: boolean;
  user?: {
    email?: string;
    name?: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}

/**
 * Check if Apple Sign-In is available on the device
 */
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  return await AppleAuthentication.isAvailableAsync();
};

/**
 * Sign in with Apple
 */
export const signInWithApple = async (): Promise<AppleAuthResult> => {
  try {

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Extract user info (only available on first sign-in)
    const { identityToken, email, fullName } = credential;

    if (!identityToken) {
      throw new Error("No identity token received from Apple");
    }

    // Get device info
    const deviceId = (await SecureStore.getItemAsync("device_id")) || undefined;
    const deviceName = "Mobile App";

    // Send to your backend
    const response = await fetch(`${API_BASE_URL}/apple/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity_token: identityToken,
        user_identifier: credential.user, // Unique user ID from Apple
        email: email || undefined,
        full_name: fullName
          ? `${fullName.givenName || ""} ${fullName.familyName || ""}`.trim()
          : undefined,
        device_id: deviceId,
        device_name: deviceName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend authentication failed:", data);
      throw new Error(data.message || "Backend authentication failed");
    }

    if (data.status === "success" && data.data) {

      const { access_token, refresh_token } = data.data;

      // Store tokens securely
      await SecureStore.setItemAsync("access_token", access_token);
      await SecureStore.setItemAsync("refresh_token", refresh_token);

      // Store Apple user identifier for future use
      await SecureStore.setItemAsync("apple_user_id", credential.user);

      return {
        success: true,
        user: {
          email: email || undefined,
          name: fullName
            ? `${fullName.givenName || ""} ${fullName.familyName || ""}`.trim()
            : undefined,
        },
        tokens: {
          accessToken: access_token,
          refreshToken: refresh_token,
        },
      };
    }

    throw new Error("Invalid response from backend");
  } catch (error: any) {
    console.error("❌ Apple Sign-In Error:", error);

    // Handle specific error cases
    if (error.code === "ERR_CANCELED") {
      return {
        success: false,
        error: "Sign-in cancelled by user",
      };
    }

    return {
      success: false,
      error: error.message || "Failed to sign in with Apple",
    };
  }
};

/**
 * Sign out (Apple doesn't have a specific sign-out, just clear local data)
 */
export const signOutFromApple = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Clear stored tokens and user data
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    await SecureStore.deleteItemAsync("apple_user_id");

    return { success: true };
  } catch (error: any) {
    console.error("Apple Sign-out Error:", error);
    return {
      success: false,
      error: error.message || "Failed to sign out",
    };
  }
};
