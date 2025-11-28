/**
 * Setup Integration Service
 *
 * Orchestrates the complete setup flow:
 * 1. Creates profile setup on backend
 * 2. Creates all children with the returned profile_setup_id
 * 3. ONLY marks setup as complete if ALL steps succeed
 *
 * CRITICAL: The completion flag (isSetupComplete) is ONLY set to true
 * after successful backend creation. If anything fails, flag stays false.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createChildProfile } from "./childProfile.service";
import { createProfileSetup } from "./profileSetup.service";
import type {
  CreateChildProfileRequest,
  CreateProfileSetupRequest,
} from "./types";

// Types for local data (from AsyncStorage)
export interface MomSetupData {
  momStatus: string; // "Pregnant", "New Mom", "Toddler Mom", "Mixed"
  selectedGoals: string[];
  partner?: {
    name: string;
    email: string;
  };
}

export interface ChildData {
  fullName: string;
  dob: string; // ISO date string
  gender: "male" | "female" | "other";
}

/**
 * Map frontend mom status to backend format
 */
function mapMomStatus(status: string): string {
  const mapping: { [key: string]: string } = {
    Pregnant: "pregnant",
    "New Mom": "new_mom",
    "Toddler Mom": "toddler_mom",
    Mixed: "mixed",
  };

  const mapped = mapping[status] || status.toLowerCase().replace(" ", "_");
  return mapped;
}

/**
 * Complete the entire setup flow:
 * 1. Create profile setup on backend
 * 2. Get profile_setup_id
 * 3. Create all children with that profile_setup_id
 * 4. Mark setup as complete ONLY if all steps succeed
 *
 * CRITICAL BUSINESS RULE:
 * - isSetupComplete is ONLY set to true if ALL steps complete successfully
 * - If ANY error occurs, the flag remains false
 * - This ensures user must retry failed setup
 */
export async function completeSetupFlow(
  momSetupData: MomSetupData,
  children: ChildData[]
): Promise<{
  success: boolean;
  profile_setup_id?: string;
  error?: { message: string; status_code?: number; detail?: string };
  childrenCreated?: number;
  childrenFailed?: number;
}> {
  let profile_setup_id: string | undefined;

  try {
    // --- Step 1: Prepare profile setup request ---
    const profileSetupRequest: CreateProfileSetupRequest = {
      mom_status: mapMomStatus(momSetupData.momStatus),
      goals: momSetupData.selectedGoals,
      partner: momSetupData.partner || null,
      children: [], // children added separately
    };

    // --- Step 2: Create profile setup on backend ---
    const profileSetup = await createProfileSetup(profileSetupRequest);

    if (!profileSetup?.id) {
      throw { message: "Failed to create profile setup - no ID returned" };
    }

    profile_setup_id = profileSetup.id;
    await AsyncStorage.setItem("profile_setup_id", profile_setup_id);

    // --- Step 3: Create children ---
    const childrenCreated: string[] = [];
    const childrenFailed: { child: ChildData; error: any }[] = [];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      try {
        const childRequest: CreateChildProfileRequest = {
          profile_setup_id,
          full_name: child.fullName,
          date_of_birth: child.dob,
          gender: child.gender,
          birth_order: i + 1,
        };
        const createdChild = await createChildProfile(childRequest);
        childrenCreated.push(createdChild.id);
      } catch (childError: any) {
        childrenFailed.push({
          child,
          error: childError?.response?.data || childError,
        });
      }
    }

    // --- Step 4: Mark setup as complete ---
    await AsyncStorage.setItem("isSetupComplete", "true");

    return {
      success: true,
      profile_setup_id,
      childrenCreated: childrenCreated.length,
      childrenFailed: childrenFailed.length,
    };
  } catch (error: any) {
    // Normalize error for easier handling in handleDone
    const normalizedError = {
      message: error?.message || "Setup failed",
      status_code: error?.response?.data?.status_code || error?.status_code,
      detail: error?.response?.data?.error?.detail || error?.detail,
    };

    await AsyncStorage.setItem("isSetupComplete", "false");

    return {
      success: false,
      profile_setup_id,
      error: normalizedError,
    };
  }
}

/**
 * Helper function to check if setup is complete
 */
export async function isSetupComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem("isSetupComplete");
    const isComplete = value === "true";
    return isComplete;
  } catch (error) {
    console.error("Error checking setup completion:", error);
    return false;
  }
}

/**
 * Helper function to reset setup (for testing/debugging)
 */
export async function resetSetup(): Promise<void> {
  await AsyncStorage.removeItem("isSetupComplete");
  await AsyncStorage.removeItem("profile_setup_id");
  await AsyncStorage.removeItem("momSetupData");
}
