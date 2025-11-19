// src/core/services/authService.ts

import apiClient from './apiClient';
// Assuming authStorage.ts is a sibling file in core/utils/
import { setAuthToken, removeAuthToken } from './authStorage'; 
import { AxiosError } from 'axios';

// --- TYPE DEFINITIONS FOR API CONTRACTS ---

// 1. STANDARD SUCCESS RESPONSE 
export interface AuthResponse {
  access_token: string; // The JWT needed for authenticated calls
  token_type: string;
  // User data or status message may also be included
}

// 2. PAYLOADS (Data sent to the API)
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

export interface VerifyCodePayload {
  email: string;
  otp_code: string;
}

export interface EmailPayload {
  email: string;
}

export interface ResetPasswordPayload {
  verification_token: string; // Token received after successful OTP verification
  password: string;
  confirm_password: string;
}

// 3. ERROR RESPONSE STRUCTURE (For safely checking error data)
export interface ValidationErrorDetail {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface ApiErrorResponse {
    detail?: string | ValidationErrorDetail[];
}

// --- CORE AUTHENTICATION FUNCTIONS ---

/**
 * Handles user registration (POST /auth/register).
 * On success, securely saves the JWT and returns user data.
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    // Note: The generic type <AuthResponse> is now correctly recognized
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);

    // On successful registration (Code 201), set the JWT for immediate session start
    await setAuthToken(response.data.access_token);
    return response.data;
  } catch (error) {
    // CRITICAL FIX: Cast the error to AxiosError<ApiErrorResponse> to safely throw it
    throw error as AxiosError<ApiErrorResponse>;
  }
}

/**
 * Handles user login (POST /auth/login).
 * On success, securely saves the JWT.
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);

    // On successful login, set the JWT for session start
    await setAuthToken(response.data.access_token);
    return response.data;
  } catch (error) {
    // FIX: Apply type assertion
    throw error as AxiosError<ApiErrorResponse>;
  }
}

/**
 * Logs the user out by clearing the locally stored JWT.
 */
export async function logout(): Promise<void> {
  await removeAuthToken();
}


// --- VERIFICATION AND RECOVERY FUNCTIONS ---

/**
 * Initiates the password recovery flow (POST /auth/forgot-password).
 * Sends the OTP code to the user's email.
 * @returns A promise that may include a verification token/ID needed for the subsequent verifyCode step.
 */
export async function forgotPassword(payload: EmailPayload): Promise<any> {
  try {
    const response = await apiClient.post('/auth/forgot-password', payload);
    return response.data;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse>;
  }
}

/**
 * Resends the verification email (POST /auth/resend-verification).
 */
export async function resendVerification(payload: EmailPayload): Promise<any> {
  try {
    const response = await apiClient.post('/auth/resend-verification', payload);
    return response.data;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse>;
  }
}


/**
 * Verifies the OTP code (POST /api/v1/auth/verify-otp or /auth/verify-email).
 * This is used for both email verification (after register) and OTP recovery (after forgot-password).
 */
export async function verifyCode(payload: VerifyCodePayload): Promise<any> {
  try {
    const response = await apiClient.post('/auth/verify-otp', payload); 
    return response.data;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse>;
  }
}


/**
 * Sets the user's new password after verification (PATCH /auth/reset-password).
 * Requires the verification token from the previous step.
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<any> {
  try {
    const response = await apiClient.patch('/auth/reset-password', payload);
    return response.data;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse>;
  }
}

/**
 * Allows an authenticated user to change their password (PATCH /auth/change-password).
 * This endpoint requires a valid, current JWT in the Authorization header.
 */
export async function changePassword(payload: ResetPasswordPayload): Promise<any> {
  try {
    const response = await apiClient.patch('/auth/change-password', payload);
    return response.data;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse>;
  }
}