// src/contexts/SetupContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ChildData,
  MomSetupData,
  SetupData,
  setupStorage,
} from "../services/setupStorageService";

interface SetupContextType {
  setupData: SetupData | null;
  isSetupCompleted: boolean;
  isLoading: boolean;
  momSetupData: MomSetupData | null;
  saveMomSetup: (data: MomSetupData) => Promise<void>;
  completeSetup: (children: ChildData[], userId: string) => Promise<void>;
  refreshSetupData: () => Promise<void>;
  clearSetup: () => Promise<void>;
  resetSetup: () => Promise<void>;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export const SetupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [momSetupData, setMomSetupData] = useState<MomSetupData | null>(null);
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load setup data on mount
  useEffect(() => {
    loadSetupData();
  }, []);

  const loadSetupData = async () => {
    try {
      setIsLoading(true);
      const [completed, data, tempData] = await Promise.all([
        setupStorage.isSetupCompleted(),
        setupStorage.getSetupData(),
        setupStorage.getTempSetupData(),
      ]);

      setIsSetupCompleted(completed);
      setSetupData(data);

      // Load mom setup from temp if exists
      if (tempData?.momSetup) {
        setMomSetupData(tempData.momSetup);
      }
    } catch (error) {
      console.error("Error loading setup data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMomSetup = async (data: MomSetupData) => {
    try {
      await setupStorage.saveMomSetup(data);
      setMomSetupData(data);
      console.log("Mom setup saved to context");
    } catch (error) {
      console.error("Error saving mom setup:", error);
      throw error;
    }
  };

  const completeSetup = async (children: ChildData[], userId: string) => {
    try {
      if (!momSetupData) {
        throw new Error("Mom setup data is missing");
      }

      const completeSetupData: SetupData = {
        userId,
        momSetup: momSetupData,
        children,
        completedAt: new Date().toISOString(),
        version: "1.0",
      };

      await setupStorage.completeSetup(completeSetupData);
      setSetupData(completeSetupData);
      setIsSetupCompleted(true);
      console.log("Complete setup saved");
    } catch (error) {
      console.error("Error completing setup:", error);
      throw error;
    }
  };

  const refreshSetupData = async () => {
    await loadSetupData();
  };

  const clearSetup = async () => {
    try {
      await setupStorage.clearSetupData();
      setSetupData(null);
      setMomSetupData(null);
      setIsSetupCompleted(false);
    } catch (error) {
      console.error("Error clearing setup:", error);
    }
  };

  const resetSetup = async () => {
    try {
      await setupStorage.resetSetup();
      setIsSetupCompleted(false);
      console.log("Setup reset - user will go through onboarding again");
    } catch (error) {
      console.error("Error resetting setup:", error);
    }
  };

  return (
    <SetupContext.Provider
      value={{
        setupData,
        isSetupCompleted,
        isLoading,
        momSetupData,
        saveMomSetup,
        completeSetup,
        refreshSetupData,
        clearSetup,
        resetSetup,
      }}
    >
      {children}
    </SetupContext.Provider>
  );
};

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error("useSetup must be used within a SetupProvider");
  }
  return context;
};
