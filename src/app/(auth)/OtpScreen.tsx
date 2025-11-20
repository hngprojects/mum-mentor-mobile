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
  verifyValue, // <--- Renamed function: now handles both OTP and Token
  resendVerification, 
  ApiErrorResponse, 
  VerificationPayload, // <--- New payload interface
  EmailPayload,
  TokenResponse,
  ServiceResponse
} from '../../core/services/authService'; 
import PrimaryButton from '../components/PrimaryButton'; 


// --- TYPE ASSERTION FOR FLOWS ---
// TokenResponse should be used for the register flow, as it contains the access_token.
// For the password reset flow, the response is expected to have a verification_token instead of (or in addition to) the access_token.
interface ResetTokenResponse extends TokenResponse {
  verification_token: string;
}

// --- Component ---
export default function OtpScreen() {
  
  // Get URL parameters (email, context, and optional verificationToken)
  const params = useLocalSearchParams<{ email: string; context?: 'register' | 'reset'; verificationToken?: string }>();
  const email = params.email;
  const context = params.context || 'register';
  const resetToken = params.verificationToken; // Token used for password recovery context

  const otpLength = 6;
  const initialResendTimer = 60; // seconds

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
    // Set focus on the first input field
    const focusTimeout = setTimeout(() => {
        inputRefs.current[0]?.focus();
    }, 100); // Small delay to ensure input is mounted

    return () => clearTimeout(focusTimeout);
  }, [email]);

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0 && !isLoading && !isResending) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isLoading, isResending]);


  // --- HANDLERS ---
  
  /**
   * Type guard to check if an error is an AxiosError.
   */
  const isAxiosError = (err: any): err is AxiosError<ApiErrorResponse> => {
    return err.isAxiosError === true;
  };

  const handleVerify = async (code?: string) => {
    // The input value (6 digits) will be the verification_value
    const verificationValue = code || otp.join('');
    if (verificationValue.length !== otpLength) {
        setVerificationError('Please enter the full 6-digit code.');
        return;
    }

    setIsLoading(true);
    setVerificationError('');

    // Determine the type for the payload based on context
    const verificationType: VerificationPayload['type'] = 
        context === 'register' ? 'email_verification' : 'password_reset';

    // Construct the payload using the new interface
    const payload: VerificationPayload = { 
        email, 
        verification_value: verificationValue,
        type: verificationType 
    };
    
    // --- DEBUG LOG: Check the exact payload and type being sent to the service ---
    console.log(`Sending Verification Payload (Type: ${verificationType}):`, payload);

    try {
      // API call now uses the unified verifyValue function
      const result: ServiceResponse<TokenResponse> = await verifyValue(payload);
      
      // --- SUCCESS HANDLING ---
      if (result.success) {
        const response = result.data;

        if (context === 'register') {
          // 1. Email Verification Success (Expecting token)
          
          const tokenResponse = response as unknown as TokenResponse;
          
          console.log("Verification Success Response (Register Context):", tokenResponse);

          if (tokenResponse.access_token) {
              // ✅ Preferred Path: Token received. Now logged in. Redirect.
              Alert.alert("Success", "Email verified and logged in! Welcome to NORA.");
              router.replace('/(tabs)/Home'); 
              
          } else {
              // ⚠️ Fallback Path: Verification succeeded, but access_token is missing (BE issue).
              // Instead of showing a broken error, redirect to Sign In so the user can proceed.
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
          // 2. Password Recovery Verification Success
          
          console.log("Verification Success Response (Reset Context):", response);

          // Assert the response to include the expected verification token for password reset
          const resetResponse = response as unknown as ResetTokenResponse; 
          
          const verificationToken = resetResponse.verification_token || resetToken; 
          
          if (!verificationToken) {
              setVerificationError("Verification successful, but missing token for password reset. Check console log for API response details.");
          } else {
              Alert.alert("Success", "Code verified. Proceeding to reset password.");
              router.replace({ 
                  pathname: '/(auth)/ResetPassword',
                  params: { 
                      verificationToken: verificationToken,
                      email: email
                  } 
              });
          }
        }
      } 
      // --- FAILURE HANDLING ---
      else { 
        const error = result.error;
        let serverMessage = 'A network or unexpected error occurred. Please check your connection.';
        
        if (isAxiosError(error)) {
            const axiosError = error;
            
            // Log relevant failure details
            console.warn(
                "Verification Server Failure:",
                { 
                    status: axiosError.response?.status, 
                    message: axiosError.response?.data?.message,
                    details: axiosError.response?.data?.detail
                }
            );

            // Robust way to get the error message
            serverMessage = axiosError.response?.data?.message 
                || (typeof axiosError.response?.data?.detail === 'string' ? axiosError.response.data.detail : undefined)
                || 'Incorrect code, expired token, or server error. Please try again.';
            
        } else {
            console.warn("Verification Error (Unexpected/Non-Axios):", error);
        }
        
        // Show the pop-up message
        Alert.alert("Verification Failed", serverMessage);

        // Set the persistent in-line error message
        setVerificationError(serverMessage); 
        
        // Clear inputs and refocus
        setOtp(Array(otpLength).fill('')); 
        inputRefs.current[0]?.focus(); 
      }

    } catch (error) {
        console.error("Unhandled Runtime Error during verification flow:", error);
        Alert.alert("Fatal Error", "An unhandled error occurred in the application. Please restart.");
        setVerificationError("An unhandled error occurred.");

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
      
      // Use the appropriate resend API
      await resendVerification(payload); 

      // Reset timer and inputs after successful resend request
      setOtp(Array(otpLength).fill(''));
      setTimer(initialResendTimer);
      inputRefs.current[0]?.focus();
      Alert.alert("Sent!", "New code has been sent to your email.");

    } catch (error) {
        // Robust error handling for resend failure
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
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericText;
      setOtp(newOtp);

      // Move focus forward if a digit was entered and it's not the last box
      if (numericText && index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all fields are filled
      if (newOtp.filter(d => d).length === otpLength) {
        handleVerify(newOtp.join(''));
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace when the current input is empty, moving focus back
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      // Clear the digit in the previous box
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
            {isResending ? 'Sending...' : 'Resend code'}
          </Text>
          {timer > 0 && <Text style={styles.timerText}>{formatTimer(timer)}</Text>}
        </TouchableOpacity>

        <PrimaryButton
          title={isLoading ? 'VERIFYING...' : 'Verify'}
          onPress={() => handleVerify()}
          disabled={!isOtpComplete || isLoading}
          isLoading={isLoading}
        />
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}