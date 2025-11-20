import * as SecureStore from 'expo-secure-store';

// --- KEYSTORE CONFIGURATION ---
const AUTH_TOKEN_KEY = 'NoraAppAuthToken';

/**
 * Persistently stores the authentication token securely using Expo SecureStore.
 * Includes crucial validation to prevent SecureStore from crashing if an invalid token type is passed.
 * @param token The JWT access token string.
 */
export async function setAuthToken(token: string): Promise<void> {
  // CRITICAL: Robust input validation to prevent SecureStore crash
  if (typeof token !== 'string' || token.length === 0) {
    console.error(
      'AUTH STORAGE CRASH PREVENTION: setAuthToken received invalid token.',
      'Received value:', token,
      'Received type:', typeof token
    );
    return;
  }
  
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    console.log("Auth token stored securely.");
  } catch (error) {
    console.error('AUTH STORAGE ERROR: Failed to save auth token.', error);
  }
}

/**
 * Retrieves the persistently stored authentication token from SecureStore.
 * @returns The stored token string, or null if not found.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('AUTH STORAGE ERROR: Failed to retrieve token.', error);
    return null;
  }
}

/**
 * Removes the stored authentication token (logout).
 */
export async function removeAuthToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    console.log("Auth token removed.");
  } catch (error) {
    console.error('AUTH STORAGE ERROR: Failed to remove token.', error);
  }
}