import axios from "axios";
// FIX: Ensure getAuthToken is imported from the correct relative path
import { getAuthToken } from "./authStorage";

// --- API BASE URL ---
// The base URL for the staging environment.
const BASE_URL = "https://api.staging.kaizen.emerj.net";

// Create a core Axios instance for making API requests.
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Timeout after 15 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// --- JWT INTERCEPTOR ---
// Implements an interceptor to automatically attach the JWT for every authenticated request.
// FIX: Added logic to skip token attachment for unauthenticated paths (like register/login).
apiClient.interceptors.request.use(
  async (config) => {
    // Define paths that MUST NOT contain an Authorization header (Login, Register, etc.)
    const unauthenticatedPaths = [
      "/auth/register",
      "/auth/login",
      "/auth/forgot-password",
      "/auth/resend-verification",
      "/auth/verify-otp",
      "/auth/verify-email",
      '/auth/reset-password',
    ];

    // Check if the current request path ends with one of the unauthenticated paths.
    // config.url contains the relative path like '/auth/register'
    const isAuthFlow = unauthenticatedPaths.some((path) =>
      config.url?.endsWith(path)
    );

    if (isAuthFlow) {
      // Skip token retrieval and attachment for authentication flow endpoints
      console.log(
        `Skipping JWT attachment for unauthenticated path: ${config.url}`
      );
      return config;
    }

    // 1. Retrieve the secure token
    const token = await getAuthToken();

    // 2. Attach the token to the Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Attached JWT to request headers.");
    } else {
      // For debugging unauthenticated requests
      console.log("No JWT found. Request will proceed unauthenticated.");
    }

    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues before sending)
    return Promise.reject(error);
  }
);

// We export the client to be used by all service files (authService.ts, taskService.ts, etc.)
export default apiClient;
