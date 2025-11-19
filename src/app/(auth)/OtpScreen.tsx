// src/app/(auth)/screens/OtpScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { AxiosError } from 'axios';

// --- Theme and Utilities ---
import { defaultTheme } from '../../core/styles/index';
import { ms, vs, rfs } from '../../core/styles/scaling';
import { Ionicons } from '@expo/vector-icons';

// --- API Service and Types ---
import { 
  verifyCode, 
  resendVerification, 
  ApiErrorResponse, 
  VerifyCodePayload,
  EmailPayload
} from '../../core/services/authService'; 
import PrimaryButton from '../components/PrimaryButton'; 


// --- Component ---
// NOTE: This component is exported as default to satisfy Expo Router's file-based routing.
export default function OtpScreen() {
  
  // Get URL parameters (email, context, and optional resetToken)
  const params = useLocalSearchParams<{ email: string; context?: 'register' | 'reset'; verificationToken?: string }>();
  const email = params.email;
  const context = params.context || 'register';
  const resetToken = params.verificationToken; // Token used for password recovery context

  const otpLength = 6;
  const initialResendTimer = 60; // seconds (increased for production use)

  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(initialResendTimer);
  const [verificationError, setVerificationError] = useState('');
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>(Array(otpLength).fill(null));
  const isOtpComplete = otp.every((digit) => digit !== '');


  // --- LIFECYCLE HOOKS ---

  // Check initial state and set timer
  useEffect(() => {
    if (!email) {
      Alert.alert("Error", "Email parameter missing. Redirecting to Login.");
      router.replace('/(auth)/SignInScreen');
    }
    inputRefs.current[0]?.focus();
    
    // Start the timer to control the resend button availability
    if (timer === initialResendTimer) {
        // Only start timer if it wasn't started automatically in the signup flow
        // setTimer(initialResendTimer); 
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0 && !isLoading) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, isLoading]);


  // --- HANDLERS ---

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('');
    if (otpCode.length !== otpLength) return;

    setIsLoading(true);
    setVerificationError('');

    const payload: VerifyCodePayload = { email, otp_code: otpCode };
    
    try {
      const response = await verifyCode(payload);
      
      // Success Logic:
      if (context === 'register') {
        // 1. New Registration Verification Success -> Go to Onboarding/App
        Alert.alert("Success", "Email verified successfully! Welcome to NORA.");
        // Redirect to the main app flow
        router.replace('/(tabs)/Home'); 
        
      } else if (context === 'reset') {
        // 2. Password Recovery Verification Success -> Go to Reset Password screen
        
        // Assuming the API returns the verification_token required for the final password change:
        const verificationToken = response.verification_token || resetToken; 
        
        Alert.alert("Success", "Code verified. Proceeding to reset password.");
        router.replace({ 
            pathname: '/(auth)/ResetPassword',
            params: { 
                // Pass the necessary token/ID to the final reset screen
                verificationToken: verificationToken,
                email: email
            } 
        });
      }

    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        console.error("OTP Verification Error:", axiosError.response?.data);
        
        // Handle API error responses (400 Invalid Code)
        setVerificationError('Incorrect code or expired token. Please try again.');
        setOtp(Array(otpLength).fill('')); // Clear inputs
        inputRefs.current[0]?.focus(); // Refocus first input

    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timer !== 0 || isResending || !email) return;

    setIsResending(true);
    setVerificationError('');
    
    try {
      const payload: EmailPayload = { email };
      
      // Use the appropriate resend API based on context
      if (context === 'register') {
           await resendVerification(payload); // Resend email verification code
      } else if (context === 'reset') {
           await resendVerification(payload); // Resend OTP for password reset
      }

      // Reset timer and inputs after successful resend request
      setOtp(Array(otpLength).fill(''));
      setTimer(initialResendTimer);
      inputRefs.current[0]?.focus();
      Alert.alert("Sent!", "New code has been sent to your email.");

    } catch (error) {
      Alert.alert("Error", "Could not resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeText = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericText;
      setOtp(newOtp);

      // Move focus forward
      if (numericText && index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all fields are filled
      if (newOtp.every((digit) => digit !== '')) {
        handleVerify(newOtp.join(''));
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setOtp(otp.map((d, i) => (i === index - 1 ? '' : d)));
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: defaultTheme.colors.backgroundMain,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: ms(50),
      paddingTop: vs(60),
      paddingBottom: vs(40),
    },
    mailIcon: {
      width: ms(80), 
      height: ms(80),
      backgroundColor: defaultTheme.colors.secondary,
      borderRadius: ms(40),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: ms(16)
    },
    title: {
      ...defaultTheme.typography.heading1,
      color: defaultTheme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: vs(24),
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: vs(16),
    },
    description: {
      ...defaultTheme.typography.bodySmall,
      color: defaultTheme.colors.textGrey1,
      textAlign: 'center',
      marginBottom: vs(10),
    },
    email: {
      ...defaultTheme.typography.bodyMedium,
      color: defaultTheme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: vs(32),
      fontFamily: defaultTheme.typography.labelMedium.fontFamily,
    },
    label: {
      ...defaultTheme.typography.heading3,
      color: defaultTheme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: vs(14),
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: ms(8),
      marginBottom: vs(16),
    },
    otpInput: {
      width: ms(48),
      height: vs(56),
      borderWidth: 1,
      borderColor: verificationError ? defaultTheme.colors.error : defaultTheme.colors.outline,
      borderRadius: ms(8),
      backgroundColor: defaultTheme.colors.textWhite,
      textAlign: 'center',
      fontSize: rfs(20),
      fontFamily: defaultTheme.typography.labelMedium.fontFamily,
      color: defaultTheme.colors.textPrimary,
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: vs(24),
    },
    resendText: {
      ...defaultTheme.typography.bodySmall,
      color: defaultTheme.colors.primary,
    },
    resendTextDisabled: {
      color: defaultTheme.colors.textGrey2,
    },
    timerText: {
      ...defaultTheme.typography.bodySmall,
      color: defaultTheme.colors.textGrey1,
      marginLeft: ms(4),
    },
    errorMessage: {
      ...defaultTheme.typography.bodySmall,
      color: defaultTheme.colors.error,
      textAlign: 'center',
      marginBottom: vs(16)
    }
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Verify Your Account</Text>

        <View style={styles.iconContainer}>
          <View style={styles.mailIcon}>
             <Ionicons name="mail-outline" size={ms(32)} color={defaultTheme.colors.textWhite} />
          </View>
        </View>

        <Text style={styles.description}>
          We just emailed you, please enter the code we sent
        </Text>
        <Text style={styles.email}>{email}</Text>

        <Text style={styles.label}>Confirmation Code</Text>

        {verificationError ? (
            <Text style={styles.errorMessage}>{verificationError}</Text>
        ) : null}

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isLoading}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleResendCode}
          disabled={timer > 0 || isResending || isLoading}
          style={styles.resendContainer}
        >
          <Text style={[styles.resendText, (timer > 0 || isResending || isLoading) && styles.resendTextDisabled]}>
            Resend code
          </Text>
          {timer > 0 && <Text style={styles.timerText}>{formatTimer(timer)}</Text>}
        </TouchableOpacity>

        <PrimaryButton
          title={isLoading ? 'VERIFYING...' : 'Verify'}
          onPress={() => handleVerify()}
          disabled={!isOtpComplete || isLoading}
          isLoading={isLoading}
        />
        
        {/* We assume this link is needed only for the Reset context, where users might go back to Login */}
        {context === 'reset' && (
             <PrimaryButton
                title="Back to Login"
                onPress={() => router.replace('/(auth)/sign-in')}
                style={{backgroundColor: defaultTheme.colors.surface_subtle, marginTop: ms(spacing.md)}}
                textStyle={{color: defaultTheme.colors.textPrimary}}
            />
        )}
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}