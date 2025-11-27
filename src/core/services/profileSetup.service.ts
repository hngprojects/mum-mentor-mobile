// core/services/profileSetup.service.ts
import apiClient from "./apiClient";
import { AxiosError } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions for Profile Setup
export interface ProfileSetupData {
  id: string; // This is the profile_setup_id we need!
  user_id: string;
  mom_status: string;
  goals: string[];
  partner: any | null;
  children: {
    id: string;
    full_name: string;
    date_of_birth: string;
    due_date: string;
    gender: string;
  }[];
}

interface ProfileSetupResponse {
  status: string;
  status_code: number;
  message: string;
  data: ProfileSetupData;
}

/**
 * Fetch the current user's profile setup
 * This returns the profile_setup_id we need for creating children
 */
export async function getProfileSetup(): Promise<ProfileSetupData | null> {
  try {
    console.log('🔵 Fetching profile setup...');
    
    const response = await apiClient.get<ProfileSetupResponse>('/api/v1/profile-setup/');
    
    console.log('📦 Profile setup response:', JSON.stringify(response.data, null, 2));
    
    const profileSetup = response.data.data;
    
    if (profileSetup && profileSetup.id) {
      console.log('✅ Profile setup retrieved successfully');
      console.log('🔑 profile_setup_id:', profileSetup.id);
      
      // Store the profile_setup_id in AsyncStorage for future use
      await AsyncStorage.setItem('profile_setup_id', profileSetup.id);
      console.log('✅ Stored profile_setup_id in AsyncStorage');
      
      return profileSetup;
    }
    
    console.warn('⚠️ Profile setup data is incomplete');
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response?.status === 404) {
      console.error('❌ Profile setup not found - user needs to complete onboarding');
    } else if (axiosError.response?.status === 401) {
      console.error('❌ Unauthorized - token may be invalid');
    } else {
      console.error('❌ Error fetching profile setup:', error);
    }
    
    return null;
  }
}

/**
 * Get profile_setup_id from AsyncStorage or fetch from API
 * This is the main function to use in your components
 */
export async function getProfileSetupId(): Promise<string | null> {
  console.log('🔍 Getting profile_setup_id...');
  
  // Try to get from AsyncStorage first
  try {
    const storedId = await AsyncStorage.getItem('profile_setup_id');
    if (storedId) {
      console.log('✅ Found profile_setup_id in AsyncStorage:', storedId);
      return storedId;
    }
  } catch (error) {
    console.error('❌ Error reading from AsyncStorage:', error);
  }
  
  // If not in storage, fetch from API
  console.log('⚠️ profile_setup_id not in storage, fetching from API...');
  const profileSetup = await getProfileSetup();
  
  if (profileSetup?.id) {
    return profileSetup.id;
  }
  
  console.error('❌ Could not retrieve profile_setup_id');
  return null;
}