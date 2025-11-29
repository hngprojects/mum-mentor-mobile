import storage from "@/src/store/storage";

// --- KEYSTORE CONFIGURATION ---
const AUTH_TOKEN_KEY = "NoraAppAuthToken";

/**
 * Persistently stores the authentication token.
 * Uses SecureStore on native platforms and localStorage on web.
 * @param token The JWT access token string.
 */
export async function setAuthToken(token: string): Promise<void> {

    // Validate token
    const trimmedToken = token?.trim();
    if (typeof trimmedToken !== "string" || trimmedToken.length === 0) {
        console.error("AUTH STORAGE: Invalid token received");
        throw new Error("Invalid token: must be a non-empty string");
    }

    try {
        storage.set(AUTH_TOKEN_KEY, trimmedToken, true);
    } catch (error) {
        console.error("AUTH STORAGE ERROR: Failed to save auth token.", error);
        throw error;
    }
}

/**
 * Retrieves the persistently stored authentication token.
 * @returns The stored token string, or null if not found.
 */
export async function getAuthToken(): Promise<string | null> {
    try {
        return storage.get(AUTH_TOKEN_KEY, true);
    } catch (error) {
        console.error("AUTH STORAGE ERROR: Failed to retrieve token.", error);
        return null;
    }
}

/**
 * Removes the stored authentication token.
 */
export async function removeAuthToken(): Promise<void> {
    try {
        return storage.remove(AUTH_TOKEN_KEY);
    } catch (error) {
        console.error("AUTH STORAGE ERROR: Failed to remove token.", error);
    }
}
