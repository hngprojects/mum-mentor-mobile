import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "@savedResources";

interface SavedResourcesContextValue {
  savedResourceIds: string[];
  isHydrated: boolean;
  saveResource: (resourceId: string) => void;
  removeResource: (resourceId: string) => void;
  toggleResource: (resourceId: string) => void;
  isResourceSaved: (resourceId: string) => boolean;
  clearSavedResources: () => void;
}

const SavedResourcesContext = createContext<SavedResourcesContextValue | undefined>(undefined);

const persistSavedResources = (resourceIds: string[]) => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resourceIds)).catch((error) => {
    console.error("Failed to persist saved resources:", error);
  });
};

export const SavedResourcesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!value) {
          return;
        }

        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            setSavedResourceIds((current) => {
              if (current.length > 0) {
                return current;
              }

              return parsed.filter((id): id is string => typeof id === "string");
            });
          }
        } catch (error) {
          console.error("Failed to parse saved resources:", error);
        }
      })
      .catch((error) => {
        console.error("Failed to load saved resources:", error);
      })
      .finally(() => setIsHydrated(true));
  }, []);

  const updateSavedResources = useCallback((updater: (previous: string[]) => string[]) => {
    setSavedResourceIds((previous) => {
      const next = updater(previous);
      persistSavedResources(next);
      return next;
    });
  }, []);

  const saveResource = useCallback((resourceId: string) => {
    updateSavedResources((previous) => {
      if (previous.includes(resourceId)) {
        return previous;
      }

      return [...previous, resourceId];
    });
  }, [updateSavedResources]);

  const removeResource = useCallback((resourceId: string) => {
    updateSavedResources((previous) => previous.filter((id) => id !== resourceId));
  }, [updateSavedResources]);

  const toggleResource = useCallback((resourceId: string) => {
    updateSavedResources((previous) => {
      if (previous.includes(resourceId)) {
        return previous.filter((id) => id !== resourceId);
      }

      return [...previous, resourceId];
    });
  }, [updateSavedResources]);

  const clearSavedResources = useCallback(() => {
    updateSavedResources(() => []);
  }, [updateSavedResources]);

  const isResourceSaved = useCallback((resourceId: string) => savedResourceIds.includes(resourceId), [savedResourceIds]);

  const value = useMemo(
    () => ({
      savedResourceIds,
      isHydrated,
      saveResource,
      removeResource,
      toggleResource,
      isResourceSaved,
      clearSavedResources,
    }),
    [savedResourceIds, isHydrated, saveResource, removeResource, toggleResource, isResourceSaved, clearSavedResources],
  );

  return (
    <SavedResourcesContext.Provider value={value}>
      {children}
    </SavedResourcesContext.Provider>
  );
};

export const useSavedResources = (): SavedResourcesContextValue => {
  const context = useContext(SavedResourcesContext);

  if (!context) {
    throw new Error("useSavedResources must be used within a SavedResourcesProvider");
  }

  return context;
};
