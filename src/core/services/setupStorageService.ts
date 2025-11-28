// src/core/services/setupStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETUP_COMPLETED_KEY = '@user_setup_completed';
const SETUP_DATA_KEY = '@user_setup_data';

export interface ChildData {
  fullName: string;
  age: string;
  dob: string;
  gender: string;
}

export interface MomSetupData {
  momStatus: string;
  selectedGoals: string[];
  customGoals: string[];
  partner?: {
    name: string;
    email: string;
  };
  notificationsEnabled: boolean;
}

export interface SetupData {
  userId: string;
  momSetup: MomSetupData;
  children: ChildData[];
  completedAt: string;
  version: string; // For future migrations
}

export const setupStorage = {
  // Check if setup is completed
  async isSetupCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(SETUP_COMPLETED_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking setup status:', error);
      return false;
    }
  },

  // Mark setup as completed
  async markSetupCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(SETUP_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Error marking setup completed:', error);
      throw error;
    }
  },

  // Save complete setup data
  async saveSetupData(data: SetupData): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(SETUP_DATA_KEY, jsonData);
    } catch (error) {
      console.error('Error saving setup data:', error);
      throw error;
    }
  },

  // Get setup data
  async getSetupData(): Promise<SetupData | null> {
    try {
      const jsonData = await AsyncStorage.getItem(SETUP_DATA_KEY);
      if (!jsonData) return null;
      
      const data = JSON.parse(jsonData) as SetupData;
      return data;
    } catch (error) {
      console.error('Error getting setup data:', error);
      return null;
    }
  },

  // Save partial mom setup data (for intermediate saves)
  async saveMomSetup(momSetup: MomSetupData): Promise<void> {
    try {
      const existingData = await this.getSetupData();
      const updatedData: Partial<SetupData> = {
        ...existingData,
        momSetup,
      };
      await AsyncStorage.setItem(
        `${SETUP_DATA_KEY}_temp`,
        JSON.stringify(updatedData)
      );
    } catch (error) {
      console.error('Error saving mom setup:', error);
      throw error;
    }
  },

  // Get temporary setup data
  async getTempSetupData(): Promise<Partial<SetupData> | null> {
    try {
      const jsonData = await AsyncStorage.getItem(`${SETUP_DATA_KEY}_temp`);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Error getting temp setup data:', error);
      return null;
    }
  },

  // Complete the entire setup process
  async completeSetup(data: SetupData): Promise<void> {
    try {
      await this.saveSetupData(data);
      await this.markSetupCompleted();
      // Clean up temp data
      await AsyncStorage.removeItem(`${SETUP_DATA_KEY}_temp`);
    } catch (error) {
      console.error('Error completing setup:', error);
      throw error;
    }
  },

  // Clear all setup data (on logout)
  async clearSetupData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        SETUP_COMPLETED_KEY,
        SETUP_DATA_KEY,
        `${SETUP_DATA_KEY}_temp`,
      ]);
    } catch (error) {
      console.error('Error clearing setup data:', error);
    }
  },

  // Reset setup (for re-onboarding)
  async resetSetup(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SETUP_COMPLETED_KEY);
    } catch (error) {
      console.error('Error resetting setup:', error);
    }
  },
};