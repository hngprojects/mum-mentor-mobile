/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// App.tsx or your main navigation file (e.g., RootNavigator.tsx)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Corrected Import Path
// The file is now in: src/features/authentication/screens/
import { ResetPasswordScreen } from './src/features/authentication/screens/ResetPasswordScreen'; 

// Define the Root Stack Param List (Must be at the root of your navigation)
type RootStackParamList = {
  // Define other screens here
  Login: undefined; 
  ResetPassword: { token?: string }; 
  Home: undefined;
};

// Create the Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Main App Component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        // TEMPORARY: Starting here for checking work
        initialRouteName="ResetPassword" 
      >
        {/* Other screens like Login and Home would go here */}

        {/* 2. Register your screen */}
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen}
          options={{
            title: 'Password Reset', 
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;