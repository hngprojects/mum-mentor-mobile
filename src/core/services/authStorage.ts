// src/core/utils/authStorage.ts

// Assuming react-native-keychain is installed in the project.
// If you are using the Expo Managed Workflow, replace this with 'expo-secure-store'.
import * as Keychain from 'react-native-keychain';

// --- KEYSTORE CONFIGURATION ---
// Define a single, non-sensitive key name (alias) for the token in the device's store.
const AUTH_TOKEN_KEY = 'NoraAppAuthToken';


/**
 * Stores the JWT access token securely in the device's keychain/keystore.
 * This is called immediately after a successful login or registration API call.
 * * @param token The JWT string received from the backend API.
 */
export async function setAuthToken(token: string): Promise<void> {
  try {
    // We store the token using a fixed username (the KEY) and the token as the password/value.
    // Keychain provides hardware-backed encryption for this data.
    await Keychain.setGenericPassword(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('AUTH STORAGE ERROR: Failed to save auth token.', error);
  }
}

/**
 * Retrieves the stored JWT access token from the secure storage.
 * This is used by the Axios Interceptor to authenticate API requests.
 * * @returns The JWT string or null if not found.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword();
    
    // Check if credentials exist and return the password (which is the token)
    if (credentials && credentials.password) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('AUTH STORAGE ERROR: Failed to retrieve token.', error);
    return null;
  }
}

/**
 * Removes the stored JWT, effectively logging the user out.
 */
export async function removeAuthToken(): Promise<void> {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('AUTH STORAGE ERROR: Failed to remove token.', error);
  }
}