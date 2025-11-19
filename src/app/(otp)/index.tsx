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
} from 'react-native';
import { defaultTheme } from '@/src/core/styles';
import { ms, vs, rfs } from '@/src/core/styles/scaling';

interface OTPVerificationScreenProps {
  title?: string;
  email: string;
  otpLength?: number;
  onVerify: (code: string) => void | Promise<void>;
  onResendCode?: () => void | Promise<void>;
  resendTimer?: number; // seconds
  showLoginLink?: boolean;
  onLoginPress?: () => void; 
}

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  title,
  email,
  otpLength = 6,
  onVerify,
  onResendCode,
  resendTimer = 25,
  onLoginPress,
  showLoginLink,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(resendTimer);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer for resend code
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChangeText = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericText;
      setOtp(newOtp);

      // Auto-focus next input
      if (numericText && index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all fields are filled
      if (index === otpLength - 1 && numericText) {
        const isComplete = newOtp.every((digit) => digit !== '');
        if (isComplete) {
          handleVerify(newOtp.join(''));
        }
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('');
    if (otpCode.length === otpLength) {
      setIsLoading(true);
      try {
        await onVerify(otpCode);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    if (timer === 0 && onResendCode) {
      setOtp(Array(otpLength).fill(''));
      setTimer(resendTimer);
      inputRefs.current[0]?.focus();
      await onResendCode();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Email Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.logoContainer}>
          <Image
              source={require('../assets/images/otp/mail.png')}
              style={styles.logo}
              resizeMode="contain"
            />
        </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          We just emailed you please enter the code we sent
        </Text>
        <Text style={styles.email}>{email}</Text>

        {/* OTP Label */}
        <Text style={styles.label}>Confirmation Code</Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!isLoading}
            />
          ))}
        </View>

        {/* Resend Code */}
        <TouchableOpacity
          onPress={handleResendCode}
          disabled={timer > 0}
          style={styles.resendContainer}
        >
          <Text
            style={[
              styles.resendText,
              timer > 0 && styles.resendTextDisabled,
            ]}
          >
            Resend code{' '}
          </Text>
          <Text style={styles.timerText}>{formatTimer(timer)}</Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (otp.some((digit) => !digit) || isLoading) &&
              styles.verifyButtonDisabled,
          ]}
          onPress={() => handleVerify()}
          disabled={otp.some((digit) => !digit) || isLoading}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        {showLoginLink && onLoginPress && (
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onLoginPress}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.backgroundMain,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: ms(24),
    paddingTop: vs(60),
    paddingBottom: vs(40),
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: ms(120),
    height: vs(40),
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
  iconCircle: {
    width: ms(56),
    height: ms(56),
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: defaultTheme.colors.outline,
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
  },
  verifyButton: {
    backgroundColor: defaultTheme.colors.primary,
    paddingVertical: vs(16),
    borderRadius: ms(8),
    alignItems: 'center',
    marginBottom: vs(16),
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    ...defaultTheme.typography.buttonText,
    color: defaultTheme.colors.textWhite,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...defaultTheme.typography.bodySmall,
    color: defaultTheme.colors.textGrey1,
  },
  loginLink: {
    ...defaultTheme.typography.bodySmall,
    color: defaultTheme.colors.primary,
    fontFamily: defaultTheme.typography.labelMedium.fontFamily,
  },
});