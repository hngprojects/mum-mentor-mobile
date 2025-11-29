"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ImageSourcePropType } from "react-native";

const STORAGE_KEY = "@journal_entries";

export interface JournalItems {
  id: number;
  title: string;
  imageUrl: ImageSourcePropType | string;
  mood: string;
  thoughts: string;
  date: string;
  category: string;
}

interface JournalContextType {
  journalEntries: JournalItems[];
  isLoading: boolean;
  isSaving: boolean;
  addEntry: (entry: Omit<JournalItems, "id">) => Promise<void>;
  updateEntry: (id: number, entry: Partial<JournalItems>) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  getEntryById: (id: number) => JournalItems | undefined;
  refreshEntries: () => Promise<void>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
};

// Simulate API delay for loading states
const simulateDelay = (ms = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [journalEntries, setJournalEntries] = useState<JournalItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load entries from AsyncStorage on mount
  const loadEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      await simulateDelay(); // Simulate API call
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setJournalEntries(parsed);
      } else {
        // Start with empty array - no static data
        setJournalEntries([]);
      }
    } catch (error) {
      console.error("Failed to load journal entries:", error);
      setJournalEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save entries to AsyncStorage
  const saveEntries = async (entries: JournalItems[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error("Failed to save journal entries:", error);
      throw error;
    }
  };

  // Initialize on mount
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Create new entry
  const addEntry = async (entry: Omit<JournalItems, "id">) => {
    try {
      setIsSaving(true);
      await simulateDelay(600); // Simulate API call

      const newId =
        journalEntries.length > 0
          ? Math.max(...journalEntries.map((e) => e.id)) + 1
          : 1;

      const newEntry: JournalItems = {
        ...entry,
        id: newId,
      };

      const updatedEntries = [...journalEntries, newEntry];
      await saveEntries(updatedEntries);
      setJournalEntries(updatedEntries);
    } finally {
      setIsSaving(false);
    }
  };

  // Update existing entry
  const updateEntry = async (id: number, updates: Partial<JournalItems>) => {
    try {
      setIsSaving(true);
      await simulateDelay(600); // Simulate API call

      const updatedEntries = journalEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      );

      await saveEntries(updatedEntries);
      setJournalEntries(updatedEntries);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete entry
  const deleteEntry = async (id: number) => {
    try {
      setIsSaving(true);
      await simulateDelay(500); // Simulate API call

      const updatedEntries = journalEntries.filter((entry) => entry.id !== id);
      await saveEntries(updatedEntries);
      setJournalEntries(updatedEntries);
    } finally {
      setIsSaving(false);
    }
  };

  // Get single entry by ID
  const getEntryById = (id: number) => {
    return journalEntries.find((entry) => entry.id === id);
  };

  // Refresh entries (pull to refresh)
  const refreshEntries = async () => {
    await loadEntries();
  };

  return (
    <JournalContext.Provider
      value={{
        journalEntries,
        isLoading,
        isSaving,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntryById,
        refreshEntries,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};
