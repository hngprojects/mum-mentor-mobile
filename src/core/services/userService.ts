import {AxiosError} from "axios";
import {ApiErrorResponse} from "./authService";
import {authApi} from "@/src/lib/api"; // Assuming this import path is correct

// --- 1. ACCURATE USER PROFILE TYPE (Based on your API response) ---
export interface UserProfile {
  // Note: ID is a string (UUID)
  id: string;
  User_id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  // The key used in the response is 'email_verified'
  email_verified: boolean;
  google_id: string | null;
  role: string;
}

// --- 2. WRAPPER TYPE (Matching the overall API structure) ---
interface ProfileResponseWrapper {
  status: string;
  status_code: number;
  message: string;
  data: UserProfile; // The actual profile is nested here
}

// --- API SERVICE FUNCTIONS ---

/**
 * Fetches the currently authenticated user's profile.
 * This function performs the protected API call that relies on the attached Bearer token.
 * * @returns The UserProfile object if the session is valid, or null otherwise.
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  // Use the correct API path confirmed in the last step
  const PROFILE_ENDPOINT = "/api/v1/auth/profile";

  try {
    // We explicitly type the response as the wrapper structure
      const response = await authApi.get<ProfileResponseWrapper>(PROFILE_ENDPOINT);

    // --- FIX APPLIED HERE ---
    const profileData = response.data.data;

    // We check for a valid nested object containing the essential email property
    if (profileData && profileData.email) {
      return profileData;
    }
    return null;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // CRITICAL: We look for explicit authentication failures (401 Unauthorized or 403 Forbidden).
    if (
      axiosError.response?.status === 401 ||
      axiosError.response?.status === 403
    ) {
      // This is the expected path when the token is expired/invalid
      console.debug(
        "Token invalid or expired (401/403). Session cannot be restored.",
        axiosError.response.data
      );
      return null;
    }

    // Handle all other errors (e.g., 500 server error, network failure, etc.)
    console.debug(
      "Error fetching user profile (unhandled server/network error):",
      axiosError.message,
      axiosError.response?.data
    );
    return null;
  }
}
