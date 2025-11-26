import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- Theme and Utilities ---
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "../../core/styles/index";
import { ms, rfs, vs } from "../../core/styles/scaling";

// --- API Service and Types ---
import { setAuthToken } from "@/src/core/services/authStorage";
import { showToast } from "@/src/core/utils/toast";
import {
  ApiErrorResponse,
  EmailPayload,
  resendVerification,
  ServiceResponse,
  VerificationPayload,
  verifyValue,
} from "../../core/services/authService";
import PrimaryButton from "../components/PrimaryButton";

interface TokenResponse {
  access_token: [string, string] | string; // Can be either array or string
  refresh_token?: [string, string] | string;
  user_id?: string;
}

// Add this helper function before your component or at the top
const extractToken = (
  tokenData: [string, string] | string | undefined
): string | undefined => {
  if (!tokenData) return undefined;
  return Array.isArray(tokenData) ? tokenData[0] : tokenData;
};

const OTP_LENGTH = 6;
const INITIAL_TIMER = 60;

// --- Component ---
function OtpScreen() {
  // Get URL parameters
  const params = useLocalSearchParams<{
    email: string;
    context?: "register" | "reset";
    verificationToken?: string;
  }>();
  const email = params.email;
  const context = params.context ?? "register";
  const resetToken = params.verificationToken;

  // State
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verificationError, setVerificationError] = useState("");
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Refs - Fixed type for React Native
  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Computed values
  const isOtpComplete = otp.every((digit) => digit !== "");
  const isResendDisabled = timer > 0 || isResending || isLoading;

  // --- Timer Effect ---
  useEffect(() => {
    if (timer > 0 && !isLoading && !isResending) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [timer, isLoading, isResending]);

  // --- Initial Setup Effect ---
  useEffect(() => {
    if (!email) {
      showToast.error(
        "Error",
        "Email parameter missing. Redirecting to Login."
      );
      router.replace("/(auth)/SignInScreen");
      return;
    }

    const focusTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        inputRefs.current[0]?.focus();
      });
    }, 100);

    return () => clearTimeout(focusTimeout);
  }, [email]);

  // --- Handlers wrapped in useCallback to prevent recreation ---
  const handleVerify = useCallback(
    async (code?: string) => {
      if (isLoading) return;

      const verificationValue = code || otp.join("");
      if (verificationValue.length !== OTP_LENGTH) {
        setVerificationError("Please enter the full 6-digit code.");
        return;
      }

      setIsLoading(true);
      setVerificationError("");

      const verificationType: VerificationPayload["type"] =
        context === "register" ? "email_verification" : "password_reset";

      const payload: VerificationPayload = {
        email,
        verification_value: verificationValue,
        type: verificationType,
      };

      try {
        const result: ServiceResponse<TokenResponse> =
          await verifyValue(payload);
        console.log("📦 Result:", result);

        if (result.success) {
          // 🔥 Change back to result.success, not result.status
          const response = result.data;

          if (context === "register") {
            // Extract token safely (handles both string and array formats)
            const accessToken = extractToken(response.access_token);

            if (accessToken) {
              // 🔥 SET AUTH TOKEN HERE, after extracting the string
              await setAuthToken(accessToken);

              // Optionally store refresh token too
              const refreshToken = extractToken(response.refresh_token);
              if (refreshToken) {
                // Store refresh token if needed
                // await SecureStore.setItemAsync('refresh_token', refreshToken);
              }

              showToast.success(
                "Success",
                "Email verified and logged in! Welcome to NORA."
              );
              router.replace("/(tabs)/Home");
            } else {
              console.warn("Verification successful but missing access_token.");
              Alert.alert(
                "Verification Success",
                "Your email has been verified. Please log in to continue.",
                [
                  {
                    text: "Log In",
                    onPress: () => router.replace("/(auth)/SignInScreen"),
                  },
                ]
              );
            }
          } else if (context === "reset") {
            // Extract token safely for password reset
            const verificationToken =
              extractToken(response.access_token) || resetToken;

            if (!verificationToken) {
              setVerificationError(
                "Verification successful, but missing token for password reset."
              );
            } else {
              showToast.success(
                "Success",
                "Code verified. Proceeding to reset password."
              );
              router.push({
                pathname: "/(auth)/ResetPassword",
                params: {
                  verificationToken: verificationToken,
                  email: email,
                },
              });
            }
          }
        } else {
          // Error handling
          const error = result.error;
          let serverMessage =
            "A network or unexpected error occurred. Please check your connection.";

          if (error && typeof error === "object" && "isAxiosError" in error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            serverMessage =
              axiosError.response?.data?.message ||
              (typeof axiosError.response?.data?.detail === "string"
                ? axiosError.response.data.detail
                : undefined) ||
              "Incorrect code, expired token, or server error. Please try again.";
          }

          showToast.error("Verification Failed", serverMessage);
          setVerificationError(serverMessage);
          setOtp(Array(OTP_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        }
      } catch (error) {
        console.error("Unhandled error during verification:", error);
        showToast.error(
          "Error",
          "An unexpected error occurred. Please try again."
        );
        setVerificationError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, otp, context, email, resetToken]
  );
  const handleResendCode = useCallback(async () => {
    // Add more defensive checks
    if (timer > 0 || isResending || isLoading || !email) {
      console.log("Resend blocked:", { timer, isResending, isLoading });
      return;
    }

    console.log("🔄 Resend code initiated");

    setIsResending(true);
    setVerificationError("");

    try {
      const payload: EmailPayload = { email };
      await resendVerification(payload);

      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(INITIAL_TIMER);
      inputRefs.current[0]?.focus();
      showToast.success("Sent!", "New code has been sent to your email.");
    } catch (error) {
      let errorMessage = "Could not resend code. Please try again.";

      if (error && typeof error === "object" && "isAxiosError" in error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        errorMessage =
          axiosError.response?.data?.message ||
          (typeof axiosError.response?.data?.detail === "string"
            ? axiosError.response.data.detail
            : errorMessage);
      }

      showToast.error("Error", errorMessage);
    } finally {
      setIsResending(false);
    }
  }, [timer, isResending, isLoading, email]);

  const handleChangeText = useCallback(
    (text: string, index: number) => {
      const numericText = text.replace(/[^0-9]/g, "");

      if (numericText.length <= 1) {
        const newOtp = [...otp];
        newOtp[index] = numericText;
        setOtp(newOtp);

        if (numericText && index < OTP_LENGTH - 1) {
          inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when complete
        if (newOtp.filter((d) => d).length === OTP_LENGTH) {
          setTimeout(() => handleVerify(newOtp.join("")), 50);
        }
      }
    },
    [otp, handleVerify]
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    },
    [otp]
  );

  const formatTimer = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {context === "register"
            ? "Verify Your Account"
            : "Reset Password Code"}
        </Text>

        <View style={styles.iconContainer}>
          <View style={styles.mailIcon}>
            <Ionicons
              name="mail-outline"
              size={ms(32)}
              color={colors.textWhite}
            />
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
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                verificationError && styles.otpInputError,
              ]}
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

        <View style={styles.resendContainer}>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={isResendDisabled}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.resendText,
                isResendDisabled && styles.resendTextDisabled,
              ]}
            >
              {isResending ? "Sending..." : "Resend code"}
            </Text>
          </TouchableOpacity>
          {timer > 0 && (
            <Text style={styles.timerText}> {formatTimer(timer)}</Text>
          )}
        </View>

        <PrimaryButton
          title={isLoading ? "VERIFYING..." : "Verify"}
          onPress={() => handleVerify()}
          disabled={!isOtpComplete || isLoading || isResending}
          isLoading={isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default OtpScreen;

// Styles outside component - CRITICAL for preventing hot refresh
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
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
    backgroundColor: colors.secondary,
    borderRadius: ms(40),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ms(16),
  },
  title: {
    fontSize: rfs(typography.heading1.fontSize),
    fontFamily: typography.heading1.fontFamily,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: vs(24),
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: vs(16),
  },
  description: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.textGrey1,
    textAlign: "center",
    marginBottom: vs(10),
  },
  email: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.labelMedium.fontFamily,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: vs(32),
  },
  label: {
    fontSize: rfs(typography.heading3.fontSize),
    fontFamily: typography.heading3.fontFamily,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: vs(14),
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: ms(8),
    marginBottom: vs(16),
  },
  otpInput: {
    width: ms(56),
    height: vs(64),
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: ms(8),
    backgroundColor: colors.textWhite,
    textAlign: "center",
    fontSize: rfs(24),
    fontFamily: typography.labelMedium.fontFamily,
    color: colors.textPrimary,
    paddingVertical: vs(12),
  },
  otpInputError: {
    borderColor: colors.error,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(24),
    minHeight: vs(30),
  },
  resendText: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.primary,
  },
  resendTextDisabled: {
    color: colors.textGrey2,
  },
  timerText: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.textGrey1,
  },
  errorMessage: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.error,
    textAlign: "center",
    marginBottom: vs(16),
  },
});
