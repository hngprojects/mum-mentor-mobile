import { AxiosError, isAxiosError } from "axios";
import apiClient from "./apiClient";
import { getAuthToken, removeAuthToken, setAuthToken } from "./authStorage";

// --- TYPES ---
export interface AuthTokenData {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
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
      console.log("Google auth token verification - stored:", storedToken ? "YES" : "NO");

      if (!storedToken) {
        console.error("CRITICAL: Token was not stored despite no errors!");
      }
    } else {
      console.error("Google login response missing access_token:", response.data);
      throw new Error("API response missing access token.");
    }

    return response.data;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse> | Error;
  }
}

export async function logout(): Promise<void> {
  await removeAuthToken();
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

export async function verifyValue(
  payload: VerificationPayload
): Promise<ServiceResponse<TokenResponse>> {
  try {
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

    const response = await apiClient.post<{
      data: TokenResponse;
      message: string;
      status: string;
      status_code: number;
    }>(apiUrl, requestBody);

    const tokenData = response.data.data;
    const token = tokenData?.access_token;

    if (token && token.length > 0) {
      await setAuthToken(token);
      console.log("Verification successful. Token stored.");
    } else {
      console.warn("Verification returned no access token:", response.data);
    }

    return { success: true, data: tokenData };
  } catch (error) {
    return { success: false, error: error as AxiosError<ApiErrorResponse> };
  }
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
  payload: ResetPasswordPayload
): Promise<MessageResponse> {
  const response = await apiClient.patch<MessageResponse>(
    "/api/v1/auth/change-password",
    payload
  );
  return response.data;
}

export async function logoutUser(): Promise<MessageResponse> {
  try {
    const response = await apiClient.post<MessageResponse>(
      "/api/v1/auth/logout"
    );
    await removeAuthToken();
    return response.data;
  } catch (error) {
    await removeAuthToken();
    throw error as AxiosError<ApiErrorResponse>;
  }
}