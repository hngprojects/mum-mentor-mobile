import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
// ✅ FIX: Assuming these services are in the same directory or accessible via './'
import { getCurrentUser, UserProfile } from "./userService";
import { getAuthToken, removeAuthToken } from "./authStorage";
import { login as apiLogin } from "./authService";

interface AuthContextType {
  user: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isSessionLoading: boolean;
  refetchUser: () => Promise<void>;
}

export const AuthSessionContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthSessionContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // Centralized function to load/fetch the user profile
  const fetchUserProfile = useCallback(async () => {
    try {
        const profile = await getCurrentUser(); // This relies on the token set in storage
        if (profile) {
            setUser(profile);
            return profile;
        } else {
            // This is the path taken if API returns 401/403
            await removeAuthToken();
            setUser(null);
            return null;
        }
    } catch (error) {
        // 📢 CRITICAL LOG: We must see this if the request fails (401/Network error)
        console.error("[AUTH CONTEXT] Error fetching user profile:", error);
        await removeAuthToken();
        setUser(null);
        return null;
    }
  }, []);

  useEffect(() => {
    async function loadSession() {
      setIsSessionLoading(true);
      try {
        const token = await getAuthToken(); // This triggers the log in authStorage

        if (token) {
          await fetchUserProfile(); // This triggers the log in fetchUserProfile
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("[Auth] Error restoring session:", error);
        setUser(null);
      } finally {
        setIsSessionLoading(false);
      }
    }
    loadSession();
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      await apiLogin({ email, password }); // This sets the new token in storage
      await fetchUserProfile(); 
    } catch (err) {
      console.error("[Auth] SignIn failed:", err);
      await removeAuthToken();
      setUser(null);
      throw err;
    }
  };

  const signOut = async () => {
    await removeAuthToken();
    setUser(null);
    router.replace("/(auth)/SignInScreen");
  };

  const refetchUser = useCallback(async () => {
      setIsSessionLoading(true);
      await fetchUserProfile();
      setIsSessionLoading(false);
  }, [fetchUserProfile]);

  const value = useMemo(() => ({ user, signIn, signOut, isSessionLoading, refetchUser }), [user, isSessionLoading, refetchUser]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}