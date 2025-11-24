import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

// Replace these with your actual Google OAuth credentials
// Get them from: https://console.cloud.google.com/
const GOOGLE_WEB_CLIENT_ID='177967447276-tsh54rjdsp3dl0u7aho6sg6l38vap45c.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = "587538345013-rfv1tk32e0r5bpeahr2oobr19qeceadn.apps.googleusercontent.com";

export interface GoogleAuthResult {
  idToken: string;
  user: {
    email: string;
    name: string;
    photo?: string;
  };
}

/**
 * Hook to use Google Authentication
 * Returns promptAsync function to trigger Google sign in
 */
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'mummentor', // Replace with your app scheme from app.json
    }),
  });

  return { request, response, promptAsync };
};

/**
 * Extract user info from Google ID token
 */
export const parseGoogleIdToken = (idToken: string): GoogleAuthResult['user'] | null => {
  try {
    const base64Url = idToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    
    return {
      email: payload.email,
      name: payload.name,
      photo: payload.picture,
    };
  } catch (error) {
    console.error('Error parsing Google ID token:', error);
    return null;
  }
};