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
    try {
      await AsyncStorage.setItem('momSetupData', JSON.stringify(data));
      setMomSetupData(data);
    } catch (error) {
      console.error('❌ SetupContext: Error saving mom setup data:', error);
      throw error;
    }
  };

  /**
   * Clear mom setup data from both state and AsyncStorage
   */
  const clearMomSetup = async () => {
    try {
      await AsyncStorage.removeItem('momSetupData');
      setMomSetupData(null);
    } catch (error) {
      console.error('❌ SetupContext: Error clearing mom setup data:', error);
      throw error;
    }
  };

  /**
   * Load mom setup data from AsyncStorage into state
   */
  const loadMomSetup = async () => {
    try {
      const data = await AsyncStorage.getItem('momSetupData');
      if (data) {
        const parsedData = JSON.parse(data) as MomSetupData;
        setMomSetupData(parsedData);
      } else {
        //
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