// src/app/(auth)/screens/SignInScreen.tsx

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


// --- Imports from Core Components and Styles (Adjust path as needed) ---
import CustomInput from '../components/CustomInput'; 
import PrimaryButton from '../components/PrimaryButton';
import { colors, typography, spacing } from '../../core/styles/index';
import { ms, rfs } from '../../core/styles/scaling';

export default function SignInScreen() {
  // --- Local State Management ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- Validation Logic (Client-Side Check) ---
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Email Validation
    if (!email || !email.includes('@')) {
      newErrors.email = 'The Email Address is incorrect.';
      isValid = false;
    }

    // Password Validation (Simulating incorrect password error shown in design)
    if (!password) {
      newErrors.password = 'The Password is incorrect.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    // --- Backend API Call Logic (Placeholder for Sprint 2) ---
    try {
      // NOTE: Here is where Axios will be integrated to POST /auth/login
      
      // Simulate API success
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      Alert.alert("Welcome Back!", "Login successful. Redirecting to app.");
      
      // On success, navigate to the main app area (e.g., the Home Dashboard tab)
      router.replace('/(tabs)/Home'); 

    } catch (error) {
      // Show generic login error (The Password/Email is incorrect)
      setErrors({
        email: 'The Email Address is incorrect',
        password: 'The Password is incorrect',
      });
      console.error("Login API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Log In</Text>

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
            // Simple client-side validation check
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
            onPress={() => Alert.alert('Navigation Required', 'Redirect to Forgot Password Flow')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
          
          {/* Log In Button */}
          <PrimaryButton
            title="Log In"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={!email || !password}
          />

          {/* Don't have an account (Redirect to Sign Up) */}
          <Text style={styles.signupText}>
            Don&apos;t have an account? {' '}
            <Text 
              style={styles.signupLink} 
              onPress={() => router.replace('/(auth)/SignUpScreen')}
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
