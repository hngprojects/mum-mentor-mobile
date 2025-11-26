// constants/index.ts
export const API_BASE_URL = "https://api.staging.kaizen.emerj.net";

export const API_ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
  REGISTER: "/auth/register",
  REFRESH_TOKEN: "/auth/refresh",
  LOGOUT: "/auth/logout",
  // Add other endpoints
  USER_PROFILE: "/api/v1/auth/profile",
};

export const AUTH_ROUTES = {
  LOGIN: "/(auth)/login",
  REGISTER: "/(auth)/register",
  ONBOARDING: "/(auth)/onboarding",
};

export const AUTH_ROUTES_LIST = [
  "/(auth)/login",
  "/(auth)/register",
  "/(auth)/onboarding",
];

// export const ACCESS_TOKEN_KEY = "access_token";
export const ACCESS_TOKEN_KEY = "NoraAppAuthToken";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const ONBOARDING_COMPLETE_KEY = "onboarding_complete";
export const REDIRECT_AFTER_LOGIN_KEY = "redirect_after_login";
