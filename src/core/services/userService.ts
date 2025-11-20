import apiClient from './apiClient';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from './authService'; // Assuming you have an ApiErrorResponse type defined here

// --- TYPE DEFINITIONS ---

/**
 * Defines the structure for the User Profile data returned by the API.
 * This should match the expected JSON structure from the /user/me endpoint.
 */
export interface UserProfile {
    id: number;
    full_name: string;
    email: string;
    is_verified: boolean;
    created_at: string;
    // Add other relevant user fields here (e.g., role, profile_picture_url)
}

// --- API SERVICE FUNCTIONS ---

/**
 * Fetches the currently authenticated user's profile.
 * This function performs the protected API call that relies on the attached Bearer token.
 * * If the API returns 200, the token is valid, and the profile is returned.
 * If the API returns 401 or 403, the token is invalid/expired, and 'null' is returned.
 * * @returns The UserProfile object if the session is valid, or null otherwise.
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  // This is the protected endpoint where the server verifies the JWT
  const PROFILE_ENDPOINT = '/user/me'; 
  
  try {
    // apiClient (via the interceptor) will automatically attach the Bearer token 
    // that was loaded from secure storage in AuthContext.
    const response = await apiClient.get<UserProfile>(PROFILE_ENDPOINT);
    
    // Check for a valid response structure
    if (response.data && response.data.email) {
        return response.data;
    }
    
    // In rare cases, if the API returns 200 but the body is empty or malformed
    console.log("API returned 200 OK but user data was incomplete or null.");
    return null;

  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    // CRITICAL: We look for explicit authentication failures (401 Unauthorized or 403 Forbidden).
    if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        // This means the token is expired, revoked, or otherwise invalid.
        // Use console.debug/log instead of console.error to avoid red screens.
        console.debug("Token invalid or expired (401/403). Session cannot be restored.", axiosError.response.data);
        return null;
    }

    // Handle all other errors (e.g., 500 server error, network failure, etc.) 
    // Use console.debug instead of console.error for all catchable errors 
    // that don't need to panic the application.
    console.debug(
        "Error fetching user profile (unhandled server/network error):", 
        axiosError.message, 
        axiosError.response?.data
    );
    return null; 
  }
}