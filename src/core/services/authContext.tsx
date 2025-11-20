import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { setAuthToken, removeAuthToken, getAuthToken } from './authStorage';
import { getCurrentUser, UserProfile } from './userService';
import { router } from 'expo-router';

// --- CONTEXT TYPES ---
interface AuthContextType {
  user: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isSessionLoading: boolean;
}

// --- CONTEXT CREATION ---
export const AuthSessionContext = createContext<AuthContextType | null>(null);

// --- HOOK FOR ACCESS ---
export function useAuth(): AuthContextType {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// --- PROVIDER COMPONENT ---
export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // --- 1. Load session on app start ---
  useEffect(() => {
    async function loadSession() {
      try {
        const storedToken = await getAuthToken();
        if (storedToken) {
          const profile = await getCurrentUser();
          if (profile) {
            setUser(profile);
            console.log('Session restored successfully.');
          } else {
            console.warn('Stored token rejected or expired. Cleaning up.');
            await removeAuthToken();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setIsSessionLoading(false);
      }
    }

    loadSession();
  }, []);

  // --- 2. Sign In ---
  const signIn = async (email: string, password: string) => {
    try {
      const { access_token } = await import('./authService').then(module => module.login({ email, password }));
      await setAuthToken(access_token);

      const profile = await getCurrentUser();
      if (profile) {
        setUser(profile);
      } else {
        throw new Error('Failed to fetch user profile after login.');
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
      await removeAuthToken();
      setUser(null);
      throw error;
    }
  };

  // --- 3. Sign Out ---
  const signOut = async () => {
    await removeAuthToken();
    setUser(null);
    router.replace('/(auth)/SignInScreen');
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      isSessionLoading,
    }),
    [user, isSessionLoading]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}
