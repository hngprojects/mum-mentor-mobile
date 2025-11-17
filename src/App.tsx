// src/App.tsx
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Import the Theme Provider component
import { AppThemeProvider } from '../src/theme/ThemeContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // The AppThemeProvider must wrap all components that need access to the theme,
    // so we place it directly under SafeAreaProvider.
    <SafeAreaProvider>
      <AppThemeProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

// AppContent remains responsible for consuming the safe areas and rendering the main UI.
function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  // NOTE: This NewAppScreen component will be replaced by your Auth/Root Navigator
  // in the next sprint as we start building Nora's specific screens.
  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;