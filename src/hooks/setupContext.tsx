// core/hooks/setupContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import MomSetupData from setupService for consistency
import type { MomSetupData } from '../core/services/setupService';

interface SetupContextType {
  momSetupData: MomSetupData | null;
  saveMomSetup: (data: MomSetupData) => Promise<void>;
  clearMomSetup: () => Promise<void>;
  loadMomSetup: () => Promise<void>;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

interface SetupProviderProps {
  children: ReactNode;
}

export const SetupProvider: React.FC<SetupProviderProps> = ({ children }) => {
  const [momSetupData, setMomSetupData] = useState<MomSetupData | null>(null);

  /**
   * Save mom setup data to both state and AsyncStorage
   */
  const saveMomSetup = async (data: MomSetupData) => {
    console.log('💾 SetupContext: Saving mom setup data...');
    try {
      await AsyncStorage.setItem('momSetupData', JSON.stringify(data));
      setMomSetupData(data);
      console.log('✅ SetupContext: Mom setup data saved successfully');
    } catch (error) {
      console.error('❌ SetupContext: Error saving mom setup data:', error);
      throw error;
    }
  };

  /**
   * Clear mom setup data from both state and AsyncStorage
   */
  const clearMomSetup = async () => {
    console.log('🗑️ SetupContext: Clearing mom setup data...');
    try {
      await AsyncStorage.removeItem('momSetupData');
      setMomSetupData(null);
      console.log('✅ SetupContext: Mom setup data cleared');
    } catch (error) {
      console.error('❌ SetupContext: Error clearing mom setup data:', error);
      throw error;
    }
  };

  /**
   * Load mom setup data from AsyncStorage into state
   */
  const loadMomSetup = async () => {
    console.log('📥 SetupContext: Loading mom setup data from storage...');
    try {
      const data = await AsyncStorage.getItem('momSetupData');
      if (data) {
        const parsedData = JSON.parse(data) as MomSetupData;
        setMomSetupData(parsedData);
        console.log('✅ SetupContext: Mom setup data loaded successfully');
      } else {
        console.log('ℹ️ SetupContext: No mom setup data found in storage');
      }
    } catch (error) {
      console.error('❌ SetupContext: Error loading mom setup data:', error);
    }
  };

  const value: SetupContextType = {
    momSetupData,
    saveMomSetup,
    clearMomSetup,
    loadMomSetup,
  };

  return (
    <SetupContext.Provider value={value}>
      {children}
    </SetupContext.Provider>
  );
};

/**
 * Hook to use the setup context
 */
export const useSetup = (): SetupContextType => {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
};