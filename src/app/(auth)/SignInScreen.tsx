// src/screens/(auth)/SignInScreen.tsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { AxiosError } from 'axios';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Imports from Core Components and Styles ---
import CustomInput from '../components/CustomInput'; 
import PrimaryButton from '../components/PrimaryButton';
import { colors, typography, spacing } from '../../core/styles/index';
import { ms, rfs } from '../../core/styles/scaling';

// --- API Service Import ---
import { login, loginWithGoogle, ApiErrorResponse } from '../../core/services/authService'; 
import { useGoogleAuth, parseGoogleIdToken } from '../../core/services/googleAuthservice';
import { getDeviceInfo } from '../../core/services/deviceInfoHelper';

// --- Setup Hook Import ---
import { useSetup } from '../../core/hooks/setupContext';
import { setupStorage } from '../../core/services/setupStorageService';

export default function SignInScreen() {
  // --- Local State Management ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // --- Setup Hook ---
  const { refreshSetupData } = useSetup();

  // --- Google Auth Hook ---
  const { request, response, promptAsync } = useGoogleAuth();

  // --- Handle Google Auth Response ---
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        handleGoogleLogin(authentication.idToken);
      }
    } else if (response?.type === 'error') {
      console.error('Google auth error:', response.error);
      Alert.alert('Google Sign In Failed', 'Unable to complete Google sign in.');
    }
  }, [response]);

  // --- Validation Logic (Client-Side Check) ---
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }

    setErrors(newErrors);
    setGeneralError(null);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      const loginPayload = { email: email.toLowerCase(), password };
      await login(loginPayload); 

      // Mark onboarding as complete after successful login
      await AsyncStorage.setItem('@OnboardingComplete', 'true');
      console.log('✅ Login successful - onboarding marked complete');

      // Refresh setup data and check if setup is completed
      await refreshSetupData();
      const isSetupDone = await setupStorage.isSetupCompleted();
      
      if (!isSetupDone) {
        // First time user - redirect to setup
        Alert.alert("Welcome!", "Let's set up your profile.");
        router.replace('/setup/Mum');
      } else {
        // Returning user - go to home
        Alert.alert("Welcome Back!", "Login successful.");
        router.replace('/(tabs)/Home');
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const statusCode = axiosError.response?.status;
      
      console.warn("Login API Failure (Expected):", statusCode, axiosError.response?.data);

      if (statusCode === 401 || statusCode === 404) {
        setErrors({
          email: 'The Email Address is incorrect or user not found.',
          password: 'The Password is incorrect.',
        });
        setGeneralError(null);
        
      } else if (statusCode === 422) {
        setGeneralError('Validation failed. Check input formats.');
        setErrors({});

      } else {
        setGeneralError('An unexpected error occurred. Please try again.');
        setErrors({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handle Google Login ---
  const handleGoogleLogin = async (idToken: string) => {
    setIsGoogleLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      // Get device information
      const deviceInfo = await getDeviceInfo();
      
      // Send ID token with device info to your backend
      await loginWithGoogle({ 
        id_token: idToken,
        device_id: deviceInfo.device_id,
        device_name: deviceInfo.device_name,
      });

      // Mark onboarding as complete after successful Google login
      await AsyncStorage.setItem('@OnboardingComplete', 'true');
      console.log('✅ Google login successful - onboarding marked complete');

      // Refresh setup data and check if setup is completed
      await refreshSetupData();
      const isSetupDone = await setupStorage.isSetupCompleted();

      // Parse user info for display (optional)
      const userInfo = parseGoogleIdToken(idToken);

      if (!isSetupDone) {
        // First time Google user - redirect to setup
        Alert.alert("Welcome!", "Let's personalize your experience.");
        router.replace('/setup/Mum');
      } else {
        // Returning Google user - go to home
        Alert.alert(
          "Welcome Back!", 
          userInfo ? `Signed in as ${userInfo.name}` : "Google login successful."
        );
        router.replace('/(tabs)/Home');
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("Google login API error:", axiosError.response?.data);
      
      setGeneralError('Google sign in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // --- Trigger Google Sign In ---
  const handleGooglePress = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error triggering Google sign in:', error);
      Alert.alert('Error', 'Failed to start Google sign in');
    }
  };

  // --- Navigation Handlers ---
  const handleForgotPassword = () => {
    router.push('/(auth)/ForgotPasswordScreen');
  };
  
  const handleSignUp = () => {
    router.push('/(auth)/SignUpScreen');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" /> 
      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Log In</Text>
          
          {/* General Error Message Display */}
          {generalError && (
            <Text style={styles.generalErrorText}>{generalError}</Text>
          )}

          {/* Email Input */}
          <CustomInput
            label="Email"
            placeholder="Enter Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            isError={!!errors.email}
            errorMessage={errors.email}
            iconName="mail-outline"
            isValid={email.includes('@') && email.length > 0 && !errors.email}
          />

          {/* Password Input */}
          <CustomInput
            label="Enter Password"
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            isPassword
            isError={!!errors.password}
            errorMessage={errors.password}
            isValid={password.length > 0 && !errors.password}
          />

          {/* Forgot Password Link */}
          <TouchableOpacity 
            style={styles.forgotPasswordLink} 
            onPress={handleForgotPassword}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
          
          {/* Log In Button */}
          <PrimaryButton
            title="Log In"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={!email || !password || isLoading}
          />

          {/* Don't have an account */}
          <Text style={styles.signupText}>
            Don&apos;t have an account? {' '}
            <Text 
              style={styles.signupLink} 
              onPress={handleSignUp}
            >
              Sign up
            </Text>
          </Text>
          
          <Text style={styles.socialLoginText}>OR CONTINUE WITH</Text>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={handleGooglePress}
              disabled={!request || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Image 
                    source={require('../../assets/images/google.png')} 
                    style={styles.socialButtonImage} 
                    resizeMode="contain"
                  />
                  <Text style={styles.socialButtonText}>Google</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, {marginLeft: ms(spacing.md)}]} 
              onPress={() => Alert.alert('Apple Login', 'Coming soon!')}
            >
              <Image 
                source={require('../../assets/images/apple.png')} 
                style={styles.socialButtonImage} 
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.backgroundMain,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.xl * 2),
    paddingBottom: ms(spacing.xl),
  },
  header: {
    textAlign: 'center',
    fontSize: rfs(typography.heading1.fontSize),
    fontFamily: typography.heading1.fontFamily,
    color: colors.textPrimary,
    marginBottom: ms(spacing.xl * 2),
  },
  generalErrorText: {
    ...typography.bodyMedium,
    color: colors.error,
    textAlign: 'center',
    marginBottom: ms(spacing.md),
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: ms(-spacing.md), 
    marginBottom: ms(spacing.xl),
  },
  forgotPasswordText: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.primary, 
    textDecorationLine: 'underline',
  },
  signupText: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: ms(spacing.lg),
    marginBottom: ms(spacing.lg),
  },
  signupLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  socialLoginText: {
    fontSize: rfs(typography.caption.fontSize),
    fontFamily: typography.caption.fontFamily,
    color: colors.textGrey1,
    textAlign: 'center',
    marginVertical: ms(spacing.md),
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
    paddingVertical: ms(spacing.sm),
    borderRadius: ms(spacing.sm),
    marginHorizontal: ms(spacing.xs),
    minHeight: ms(50), 
  },
  socialButtonImage: {
    width: rfs(24),
    height: rfs(24),
    marginRight: ms(spacing.sm),
  },
  socialButtonText: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
  }
});