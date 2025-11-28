import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, isAxiosError } from "axios";
import apiClient from "./apiClient";
import { getAuthToken, removeAuthToken, setAuthToken } from "./authStorage";
import { getProfileSetup } from "./profileSetup.service";

// --- TYPES ---
export interface AuthTokenData {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    profile_setup_id?: string;
  };
}

export interface LoginAPIResponse {
  data: AuthTokenData;
  message: string;
  status: string;
  status_code: number;
}

export interface GoogleAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type TokenResponse = AuthTokenData;

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  confirm_password: string;
}
export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export interface GoogleAuthPayload {
  id_token: string;
  device_id?: string;
  device_name?: string;
}

export interface VerificationPayload {
  email: string;
  verification_value: string;
  type: "email_verification" | "password_reset";
}

export interface EmailPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface MessageResponse {
  message: string;
}

export interface DeleteAccountPayload {
  confirmation_phrase: string;
  password: string;
}

export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiErrorResponse {
  detail?: string | ValidationErrorDetail[];
  message?: string;
}

export type ServiceResponse<T> =
  | { success: true; data: T }
  | { success: false; error: AxiosError<ApiErrorResponse> };

// --- AUTH FUNCTIONS ---
export async function register(
  payload: RegisterPayload
): Promise<MessageResponse> {
  try {
    const sanitizedPayload = { ...payload, phone: payload.phone || "" };
    const response = await apiClient.post<MessageResponse>(
      "/api/v1/auth/register",
      sanitizedPayload
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error("Registration API Failed:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error("Registration failed with non-Axios error:", error);
    }
    throw error as AxiosError<ApiErrorResponse>;
  }
}

export async function login(payload: LoginPayload): Promise<AuthTokenData> {
  try {
    const response = await apiClient.post<LoginAPIResponse>(
      "/api/v1/auth/login",
      payload
    );

    const tokenData = response.data.data;
    const token = tokenData?.access_token;

    if (token && token.length > 0) {
      await setAuthToken(token);

      // Verify token was actually stored
      const storedToken = await getAuthToken();
      console.log("Token verification - stored:", storedToken ? "YES" : "NO");

      if (!storedToken) {
        console.error("CRITICAL: Token was not stored despite no errors!");
      }

      // ✅ Fetch and store profile_setup_id after successful login
      console.log("🔄 Fetching profile setup...");
      try {
        await getProfileSetup();
        console.log("✅ Profile setup fetched and stored");
      } catch (profileError) {
        console.error("⚠️ Could not fetch profile setup:", profileError);
        // Don't fail login if profile setup fetch fails
      }
    } else {
      console.error("Login response missing access_token:", response.data);
      throw new Error("API response missing access token.");
    }

    return tokenData;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse> | Error;
  }
}

/**
 * Google Authentication
 * Sends Google ID token to backend for verification and login
 */
export async function loginWithGoogle(
  payload: GoogleAuthPayload
): Promise<GoogleAuthResponse> {
  try {
    const response = await apiClient.post<GoogleAuthResponse>(
      "/api/v1/google/login",
      payload
    );

    const token = response.data.access_token;

    if (token && token.length > 0) {
      await setAuthToken(token);

      // Verify token was actually stored
      const storedToken = await getAuthToken();
      console.log(
        "Google auth token verification - stored:",
        storedToken ? "YES" : "NO"
      );

      if (!storedToken) {
        console.error("CRITICAL: Token was not stored despite no errors!");
      }

      // ✅ Fetch and store profile_setup_id after successful Google login
      console.log("🔄 Fetching profile setup...");
      try {
        await getProfileSetup();
        console.log("✅ Profile setup fetched and stored");
      } catch (profileError) {
        console.error("⚠️ Could not fetch profile setup:", profileError);
        // Don't fail login if profile setup fetch fails
      }
    } else {
      console.error(
        "Google login response missing access_token:",
        response.data
      );
      throw new Error("API response missing access token.");
    }

    return response.data;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse> | Error;
  }
}

export async function logout(): Promise<void> {
  await removeAuthToken();
  await AsyncStorage.removeItem("profile_setup_id");
}

// --- VERIFICATION AND RECOVERY ---
export async function forgotPassword(
  payload: EmailPayload
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    "/api/v1/auth/forgot-password",
    payload
  );
  return response.data;
}

export async function resendVerification(
  payload: EmailPayload
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    "/api/v1/auth/resend-verification",
    payload
  );
  return response.data;
}

// services/auth.api.ts
export async function verifyValueApi(
  payload: VerificationPayload
): Promise<TokenResponse> {
  let apiUrl: string;
  let requestBody: Record<string, string>;

  if (payload.type === "email_verification") {
    apiUrl = "/api/v1/auth/verify-email";
    requestBody = { token: payload.verification_value };
  } else if (payload.type === "password_reset") {
    apiUrl = "/api/v1/auth/verify-otp";
    requestBody = {
      otp_code: payload.verification_value,
      otp_type: "password_reset",
    };
  } else {
    throw new Error("Invalid verification type provided.");
  }

  const response = await apiClient.post(apiUrl, requestBody);

  console.log("Raw API Response:", JSON.stringify(response.data, null, 2));

  let tokenData: TokenResponse;

  if (payload.type === "email_verification") {
    const responseData = response.data.data;

    if (Array.isArray(responseData)) {
      const token = responseData[0];
      tokenData = {
        access_token: token,
        refresh_token: "",
        user: {
          id: "",
          email: payload.email,
          full_name: "",
        },
      };
    } else {
      tokenData = responseData;
    }

    const token = tokenData?.access_token;
    console.log(
      "✅ Email verification token:",
      token?.substring(0, 20) + "..."
    );

    if (token && token.length > 0) {
      await setAuthToken(token);
      console.log("Email verification successful. Token stored.");

      try {
        await getProfileSetup();
      } catch (profileError) {
        console.error("⚠️ Could not fetch profile setup:", profileError);
      }
    }
  } else if (payload.type === "password_reset") {
    console.log("Password reset OTP verified successfully");

    const responseData = response.data.data;

    // Extract the actual JWT token from the array format
    const accessToken = Array.isArray(responseData.access_token)
      ? responseData.access_token[0]
      : responseData.access_token;

    const refreshToken = Array.isArray(responseData.refresh_token)
      ? responseData.refresh_token[0]
      : responseData.refresh_token;

    tokenData = {
      access_token: accessToken,
      refresh_token: refreshToken || "",
      user: {
        id: responseData.user_id || "",
        email: payload.email,
        full_name: "",
      },
    };

    console.log(
      "✅ Password reset verification token (JWT):",
      accessToken?.substring(0, 20) + "..."
    );
  } else {
    throw new Error("Invalid verification type provided.");
  }

  return tokenData;
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<MessageResponse> {
  const response = await apiClient.patch<MessageResponse>(
    "/api/v1/auth/reset-password",
    payload
  );
  return response.data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<string> {
  try {
    const response = await apiClient.patch<string>(
      "/api/v1/auth/change-password",
      payload
    );
    return response.data;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse>;
  }
}

export async function logoutUser(): Promise<MessageResponse> {
  try {
    const response = await apiClient.post<MessageResponse>(
      "/api/v1/auth/logout"
    );

    await removeAuthToken();
    await AsyncStorage.clear(); // clears all stored keys

    return response.data;
  } catch (error) {
    await removeAuthToken();
    await AsyncStorage.clear(); // also clear on error
    throw error as AxiosError<ApiErrorResponse>;
  }
}

/**
 * Delete Account
 * Permanently deletes user account and all associated data
 * Requires confirmation phrase "DELETE MY ACCOUNT" and user's current password
 * Removes auth token after successful deletion
 */
export async function deleteAccount(
  payload: DeleteAccountPayload
): Promise<string> {
  try {
    const response = await apiClient.delete<string>("/api/v1/auth/delete", {
      data: payload,
    });
    await removeAuthToken();
    await AsyncStorage.removeItem("profile_setup_id");
    return response.data;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse>;
  }
}
