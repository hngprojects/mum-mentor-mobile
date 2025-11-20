import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { AxiosError } from 'axios';
// FIX: Import StatusBar component
import { StatusBar } from 'expo-status-bar';

// --- Imports from Core Components and Styles (Adjust path as needed) ---
import CustomInput from '../components/CustomInput'; 
import PrimaryButton from '../components/PrimaryButton';
import { colors, typography, spacing } from '../../core/styles/index';
import { ms, rfs } from '../../core/styles/scaling';

// --- API Service Import ---
import { login, ApiErrorResponse } from '../../core/services/authService'; 


export default function SignInScreen() {
  // --- Local State Management ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // --- Validation Logic (Client-Side Check) ---
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Email Validation
    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password Validation
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
      // 1. CALL THE LOGIN SERVICE
      const loginPayload = { email, password };
      
      // FIX: Call the login function without assigning the unused return value
      // The login function handles the token saving internally upon success.
      await login(loginPayload); 

      // 2. SUCCESS NAVIGATION
      Alert.alert("Welcome Back!", "Login successful.");
      router.replace('/(tabs)/Home'); 

    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const statusCode = axiosError.response?.status;
      
      console.error("Login API Error:", statusCode, axiosError.response?.data);

      // 3. ERROR HANDLING based on API responses
      if (statusCode === 401 || statusCode === 404) {
        // Handle Invalid Credentials (401) or User Not Found (404)
        setErrors({
          email: 'The Email Address is incorrect or user not found.',
          password: 'The Password is incorrect.',
        });
        
      } else if (statusCode === 422) {
        // Handle Validation Errors (e.g., password too short)
        setGeneralError('Validation failed. Check input formats.');

      } else {
        // Catch-all for 500 or network errors
        setGeneralError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  
  // --- Navigation Handlers ---
  const handleForgotPassword = () => {
    router.push('/(auth)/ForgotPasswordScreen');
  };
  
  const handleSignUp = () => {
    router.replace('/(auth)/SignUpScreen');
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* FIX: Set the status bar style to dark content for a light screen background */}
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

          {/* Don't have an account (Redirect to Sign Up) */}
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

          {/* Social Login Buttons (Google / Apple) */}
          <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Google Login')}>
                <Image 
                  source={require('../../assets/images/google.png')} 
                  style={styles.socialButtonImage} 
                  resizeMode="contain"
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, {marginLeft: ms(spacing.md)}]} onPress={() => Alert.alert('Apple Login')}>
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
      paddingTop: ms(spacing.xl * 2), // Extra space below the header
      paddingBottom: ms(spacing.xl),
    },
    header: {
      textAlign: 'center',
      fontSize: rfs(typography.heading1.fontSize),
      fontFamily: typography.heading1.fontFamily,
      color: colors.textPrimary,
      marginBottom: ms(spacing.xl * 2), // Large space below header
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
    socialButtonIcon: {
        marginRight: ms(spacing.sm),
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