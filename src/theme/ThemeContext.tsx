// src/theme/ThemeContext.tsx
// Purpose: Creates a React Context to globally share 
// the immutable AppTheme (Colors, Typography, Spacing)
// This acts as the global 'theme store'.

import React, { createContext, useContext, useMemo } from 'react';
import { AppTheme, defaultTheme } from './constants';

// --- 1. Context Creation ---
// Create the Context object. It is typed to hold
// the AppTheme structure or be undefined (the default value).
// The explicit 'undefined' default value allows us to check
// if the Provider is missing at runtime.

const ThemeContext = createContext<AppTheme | undefined>(undefined);

// --- 2. The Provider Component ---
// This component wraps the entire application,
// making the 'defaultTheme' available to all children.
interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  
  // Use useMemo to stabilize the theme object's reference. 
  // Since the defaultTheme object is static (no light/dark mode logic yet), 
  // this prevents unnecessary re-renders in deep consumer components.
  const theme = useMemo(() => defaultTheme, []); 

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- 3. The Custom Hook ---
// This is the clean, type-safe interface developers
// use to "pull" the theme data.
export const useTheme = (): AppTheme => {
  const context = useContext(ThemeContext);

  // Critical Runtime Check: If context is undefined, the
  // hook was called outside the Provider.
  if (context === undefined) {
    // Throws a helpful error during development,
    // preventing silent failures.
    throw new Error('useTheme must be used within an AppThemeProvider. Please wrap your root component in <AppThemeProvider>.');
  }

  // Returns the complete AppTheme object (colors, typography, spacing).
  return context;
};

// Export the hook and provider for use in src/App.tsx and all component files.
export default ThemeContext;