import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
  verifyValue,
  resendVerification, 
  ApiErrorResponse, 
  VerificationPayload,
  EmailPayload,
  TokenResponse,
  ServiceResponse
} from '../../core/services/authService'; 
import PrimaryButton from '../components/PrimaryButton'; 


// --- Custom Hook for Volatile State Persistence ---
const initialResendTimer = 60; // seconds

/**
 * Encapsulates the timer, loading, and resending state to make it potentially 
 * more resilient to Fast Refresh state loss.
 */
const useOtpTimer = () => {
    const [timer, setTimer] = useState(initialResendTimer);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // Countdown timer effect is now isolated here
    useEffect(() => {
        if (timer > 0 && !isLoading && !isResending) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer, isLoading, isResending]);
    
    // Reset timer function for external use (e.g., after successful resend)
    const resetTimer = () => setTimer(initialResendTimer);

    return { timer, resetTimer, isLoading, setIsLoading, isResending, setIsResending };
};


// --- Component ---
export default function OtpScreen() {
  
  // Get URL parameters (email, context, and optional verificationToken)
  const params = useLocalSearchParams<{ email: string; context?: 'register' | 'reset'; verificationToken?: string }>();
  const email = params.email;
  const context = params.context ?? 'register';
  const resetToken = params.verificationToken;

  const otpLength = 6;
  
  // Use the custom hook to manage volatile state
  const { 
    timer, 
    resetTimer, 
    isLoading, 
    setIsLoading, 
    isResending, 
    setIsResending 
  } = useOtpTimer();

  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [verificationError, setVerificationError] = useState('');

  const inputRefs = useRef<(TextInput | null)[]>(Array(otpLength).fill(null));
  const isOtpComplete = otp.every((digit) => digit !== '');


  // --- LIFECYCLE HOOKS ---

  // Check initial state and set focus
  useEffect(() => {
    if (!email) {
      Alert.alert("Error", "Email parameter missing. Redirecting to Login.");
      router.replace('/(auth)/SignInScreen');
      return; 
    }
    // Set focus on the first input field
    const focusTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
            inputRefs.current[0]?.focus();
        });
    }, 100); 

    return () => clearTimeout(focusTimeout);
  }, [email]);
  
  // --- HANDLERS ---
  
  /**
   * Type guard to check if an error is an AxiosError.
   */
  const isAxiosError = (err: any): err is AxiosError<ApiErrorResponse> => {
    return err && typeof err === 'object' && err.isAxiosError === true;
  };

  const handleVerify = async (code?: string) => {
    const verificationValue = code || otp.join('');
    if (verificationValue.length !== otpLength) {
        setVerificationError('Please enter the full 6-digit code.');
        return;
    }

    setIsLoading(true);
    setVerificationError('');

    const verificationType: VerificationPayload['type'] = 
        context === 'register' ? 'email_verification' : 'password_reset';

    const payload: VerificationPayload = { 
        email, 
        verification_value: verificationValue,
        type: verificationType 
    };
    
    console.log(`Sending Verification Payload (Type: ${verificationType}):`, payload);

    try {
      const result: ServiceResponse<TokenResponse> = await verifyValue(payload);
      
      if (result.success) {
        const response = result.data;

        // Reset loading state immediately on success before navigating
        setIsLoading(false); 
        
        if (context === 'register') {
          const tokenResponse = response as TokenResponse;
          
          if (tokenResponse.access_token) {
              Alert.alert("Success", "Email verified and logged in! Welcome to NORA.");
              router.replace('/(tabs)/Home'); 
          } else {
              console.warn("Verification successful but missing access_token. Redirecting to Sign In.");
              Alert.alert(
                  "Verification Success", 
                  "Your email has been verified. Please log in to continue.",
                  [{ 
                      text: "Log In", 
                      onPress: () => router.replace('/(auth)/SignInScreen') 
                  }]
              );
          }
          
        } else if (context === 'reset') {
          const verificationToken = response.access_token || resetToken; 
          
          if (!verificationToken) {
              setVerificationError("Verification successful, but missing token for password reset.");
          } else {
              Alert.alert("Success", "Code verified. Proceeding to reset password.");
              router.push({ 
                  pathname: '/(auth)/ResetPassword',
                  params: { 
                      verificationToken: verificationToken,
                      email: email
                  } 
              });
          }
        }
      } 
      else { 
        const error = result.error;
        let serverMessage = 'A network or unexpected error occurred. Please check your connection.';
        
        if (isAxiosError(error)) {
            const axiosError = error;
            
            console.warn(
                "Verification Server Failure:",
                { 
                    status: axiosError.response?.status, 
                    message: axiosError.response?.data?.message,
                    details: axiosError.response?.data?.detail
                }
            );

            serverMessage = axiosError.response?.data?.message 
                || (typeof axiosError.response?.data?.detail === 'string' ? axiosError.response.data.detail : undefined)
                || 'Incorrect code, expired token, or server error. Please try again.';
            
        } else {
            console.error("Verification Error (Unexpected/Non-Axios):", error);
        }
        
        Alert.alert("Verification Failed", serverMessage);
        setVerificationError(serverMessage); 
        
        setOtp(Array(otpLength).fill('')); 
        inputRefs.current[0]?.focus(); 
      }

    } catch (error) {
        console.error("Unhandled Runtime Error during verification flow:", error);
        Alert.alert("Fatal Error", "An unhandled error occurred in the application. Please restart.");
        setVerificationError("An unhandled error occurred.");

    } finally {
      // Ensure loading is set to false in case of error or unhandled exception
      setIsLoading(false); 
    }
  };

  const handleResendCode = async () => {
    // Check all conditions to prevent multiple resend attempts
    if (timer > 0 || isResending || isLoading || !email) return;

    setIsResending(true);
    setVerificationError('');
    
    try {
      const payload: EmailPayload = { email };
      
      await resendVerification(payload); 

      // Reset state after successful resend request
      setOtp(Array(otpLength).fill(''));
      resetTimer(); // Reset timer via the hook
      inputRefs.current[0]?.focus();
      Alert.alert("Sent!", "New code has been sent to your email.");

    } catch (error) {
        let errorMessage = "Could not resend code. Please try again.";
        if (isAxiosError(error)) {
            const axiosError = error;
            errorMessage = axiosError.response?.data?.message 
                || (typeof axiosError.response?.data?.detail === 'string' ? axiosError.response.data.detail : errorMessage);
            console.error("Resend Verification Error:", axiosError.response?.data);
        } else {
            console.error("Resend Verification Unexpected Error:", error);
        }
        Alert.alert("Error", errorMessage);
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

      if (numericText && index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit after a small delay to allow the last digit to render
      if (newOtp.filter(d => d).length === otpLength) {
        setTimeout(() => handleVerify(newOtp.join('')), 50); 
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

  // Dynamic style for OTP input border color
  const getOtpInputStyle = () => [
    styles.otpInput,
    {
      borderColor: verificationError 
        ? defaultTheme.colors.error 
        : defaultTheme.colors.outline,
    }
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
            {context === 'register' ? 'Verify Your Account' : 'Reset Password Code'}
        </Text>

        <View style={styles.iconContainer}>
          <View style={styles.mailIcon}>
             <Ionicons name="mail-outline" size={ms(32)} color={defaultTheme.colors.textWhite} />
          </View>
        </View>

        <Text style={styles.description}>
          We sent a code to the email address:
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
              style={getOtpInputStyle()}
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
            {isResending ? 'Sending...' : 'Resend code'}
          </Text>
          {timer > 0 && <Text style={styles.timerText}>{formatTimer(timer)}</Text>}
        </TouchableOpacity>

        <PrimaryButton
          title={isLoading ? 'VERIFYING...' : 'Verify'}
          onPress={() => handleVerify()}
          // Disabled state includes all loading/resending statuses
          disabled={!isOtpComplete || isLoading || isResending}
          isLoading={isLoading}
        />
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Move styles outside component to prevent recreation on every render
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