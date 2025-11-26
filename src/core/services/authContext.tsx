import { router } from "expo-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAuthToken, removeAuthToken } from "./authStorage";
import { getCurrentUser, UserProfile } from "./userService";
// Import the login function directly from authService
import { login as apiLogin } from "./authService";

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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// --- PROVIDER COMPONENT ---
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // --- 1. Load session on app start ---
  useEffect(() => {
    async function loadSession() {
      try {
        const storedToken = await getAuthToken();
        if (storedToken) {
          // getCurrentUser relies on the token being available in storage,
          // which is loaded by the interceptor.
          const profile = await getCurrentUser();
          if (profile) {
            setUser(profile);
            console.log("Session restored successfully.");
          } else {
            console.warn("Stored token rejected or expired. Cleaning up.");
            await removeAuthToken();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error restoring session:", error);
      } finally {
        setIsSessionLoading(false);
      }
    }

    loadSession();
  }, []);

  // --- 2. Sign In ---
  const signIn = async (email: string, password: string) => {
    try {
      // 1. Call login. The internal `authService.login` function is responsible for
      //    calling the API, retrieving the token, and storing it via `setAuthToken`.
      //    We rely entirely on that function to manage storage.
      await apiLogin({ email, password });

      // 2. Immediately validate the newly stored token by fetching the profile.
      //    The apiClient interceptor will now successfully grab the token stored by apiLogin.
      const profile = await getCurrentUser();

      if (profile) {
        setUser(profile);
      } else {
        // If profile fetch fails, it means the stored token is invalid,
        // so we must clean up and throw an error.
        await removeAuthToken();
        throw new Error("Failed to fetch user profile after successful login.");
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      await removeAuthToken();
      setUser(null);
      throw error;
    }
  };

  // --- 3. Sign Out ---
  const signOut = async () => {
    await removeAuthToken();
    setUser(null);
    router.replace("/(auth)/SignInScreen");
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

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}
