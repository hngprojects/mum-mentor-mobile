// core/services/profileSetup.service.ts

// ✅ CHANGE: Import the unified client and remove the local 'axios' import
import apiClient from "./apiClient"; 
import { AxiosError } from "axios"; // Keep this for type checking
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ChildProfile } from "../../types/child.types";

// ======================================================
// API CONFIGURATION - REMOVED: Now handled in apiClient.ts
// ======================================================

// ======================================================
// INTERCEPTORS - REMOVED: Now handled in apiClient.ts
// ======================================================

// ======================================================
// TYPES (Remain the same)
// ======================================================
// ... (Your types remain here) ...

export interface CreateProfileSetupRequest {
  mom_status: string;
  goals: string[];
  partner: { name: string; email: string } | null;
  children: any[]; // The children field is usually empty on creation
}
export interface ProfileSetupData {
  id: string;
  user_id: string;
  mom_status: string;
  goals: string[];
  partner: { name: string; email: string } | null;
  children: ChildProfile[];
  created_at?: string;
  updated_at?: string;
}

interface ProfileSetupResponse {
  status: string;
  status_code: number;
  message: string;
  data: ProfileSetupData;
}

export async function createProfileSetup(
  data: CreateProfileSetupRequest
): Promise<ProfileSetupData | { id: string }> {
  try {

    // FIX: Use the imported apiClient instead of the local 'api' instance
    const response = await apiClient.post("/api/v1/profile-setup/", data);
    const rawData = response.data;

    let profileSetupId: string;

    if (typeof rawData === "string") {
      profileSetupId = rawData;
    } else if (rawData?.data?.id) {
      profileSetupId = rawData.data.id;
    } else {
      throw new Error("Unexpected profile setup response format");
    }

    await AsyncStorage.setItem("profile_setup_id", profileSetupId);

    return { id: profileSetupId };
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    const status = axiosError.response?.status;

    // ... (Error handling logic remains the same) ...
    if (status === 422) {
      const detail = axiosError.response?.data?.detail;
      if (Array.isArray(detail)) {
        const msg = detail.map((err: any) => `${err.loc.join(".")}: ${err.msg}`).join(", ");
        throw new Error(`Validation failed: ${msg}`);
      }
      throw new Error("Validation failed");
    }

    if (status === 409) throw new Error("Profile setup already exists");
    if (status === 401) throw new Error("Unauthorized - please log in again");

    throw new Error("Failed to create profile setup");
  }
}

// ======================================================
// FETCH PROFILE SETUP
// ======================================================

export async function getProfileSetup(): Promise<ProfileSetupData | null> {
  try {
    // ✅ FIX: Use the imported apiClient instead of the local 'api' instance
    const response = await apiClient.get<ProfileSetupResponse>("/api/v1/profile-setup/");
    const profileSetup = response.data.data;

    if (profileSetup?.id) {
      await AsyncStorage.setItem("profile_setup_id", profileSetup.id);
      return profileSetup;
    }

    console.warn("⚠️ Profile setup data incomplete");
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) console.error("❌ Profile setup not found");
    else if (axiosError.response?.status === 401) console.error("❌ Unauthorized");
    else console.error("❌ Error fetching profile setup:", error);

    return null;
  }
}

// ======================================================
// GET profile_setup_id (Storage → API fallback)
// ======================================================

export async function getProfileSetupId(): Promise<string | null> {
  try {
    const storedId = await AsyncStorage.getItem("profile_setup_id");
    if (storedId) return storedId;
  } catch (error) {
    console.error("❌ Error reading AsyncStorage:", error);
  }

  const profileSetup = await getProfileSetup();
  return profileSetup?.id || null;
}