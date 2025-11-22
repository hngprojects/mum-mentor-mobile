import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { googleAuth, AuthTokenData } from './authService';

/**
 * Google OAuth Service
 * Handles Google Sign-In flow and integrates with backend API
 */

export interface GoogleAuthResponse {
  success: boolean;
  data?: AuthTokenData;
  error?: string;
}

/**
 * Gets device information for the authentication request
 */
function getDeviceInfo() {
  const deviceName = Device.deviceName ||
                     Device.modelName ||
                     `${Platform.OS} Device`;

  // Generate a unique device ID using available device info
  const deviceId = Device.osBuildId ||
                   Device.osInternalBuildId ||
                   `${Platform.OS}-${Date.now()}`;

  return {
    device_name: deviceName,
    device_id: deviceId,
  };
}

/**
 * Initiates Google Sign-In flow and authenticates with backend
 * @returns GoogleAuthResponse with user data or error
 */
export async function signInWithGoogle(): Promise<GoogleAuthResponse> {
  try {
    // Step 1: Check if Google Play Services are available (Android only)
    await GoogleSignin.hasPlayServices();

    // Step 2: Sign in with Google
    const userInfo = await GoogleSignin.signIn();

    // Step 3: Get the ID token from Google
    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      throw new Error('Failed to get ID token from Google');
    }

    // Step 4: Get device information
    const deviceInfo = getDeviceInfo();

    // Step 5: Authenticate with backend API
    const payload = {
      id_token: idToken,
      device_id: deviceInfo.device_id,
      device_name: deviceInfo.device_name,
    };

    console.log('Authenticating with backend...', {
      device_id: deviceInfo.device_id,
      device_name: deviceInfo.device_name,
    });

    // Step 6: Call the backend API (token is stored automatically in authService)
    const tokenData = await googleAuth(payload);

    return {
      success: true,
      data: tokenData,
    };

  } catch (error: any) {
    console.error('Google Sign-In Error:', error);

    // Handle specific error types
    if (error.code) {
      switch (error.code) {
        case 'SIGN_IN_CANCELLED':
          return {
            success: false,
            error: 'Sign-in was cancelled',
          };
        case 'IN_PROGRESS':
          return {
            success: false,
            error: 'Sign-in is already in progress',
          };
        case 'PLAY_SERVICES_NOT_AVAILABLE':
          return {
            success: false,
            error: 'Google Play Services not available',
          };
        default:
          return {
            success: false,
            error: error.message || 'Failed to sign in with Google',
          };
      }
    }

    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Signs out from Google
 */
export async function signOutFromGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut();
    console.log('Signed out from Google successfully');
  } catch (error) {
    console.error('Error signing out from Google:', error);
    throw error;
  }
}

/**
 * Checks if user is currently signed in with Google
 */
export async function isGoogleSignedIn(): Promise<boolean> {
  try {
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    console.error('Error checking Google sign-in status:', error);
    return false;
  }
}

/**
 * Gets current Google user info if signed in
 */
export async function getCurrentGoogleUser() {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    return userInfo;
  } catch (error) {
    console.error('Error getting current Google user:', error);
    return null;
  }
}
