import { AxiosError } from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Imports from Core Components and Styles ---
import { colors, spacing, typography } from "../../core/styles/index";
import { ms, rfs } from "../../core/styles/scaling";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";

// --- API Service and Types ---
import { showToast } from "@/src/core/utils/toast";
import {
  ApiErrorResponse,
  EmailPayload,
  forgotPassword,
} from "../../core/services/authService";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Client-side validation helper
  const isEmailValid =
    email.includes("@") && email.includes(".") && email.length > 0;

  // --- Client-Side Validation Logic ---
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Email Validation (Simple check for presence of @ and .)
    if (!email || !isEmailValid) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendCode = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const payload: EmailPayload = { email };

    // --- LIVE API CALL INTEGRATION ---
    try {
      // Call the authentication service to initiate the forgot password flow
      await forgotPassword(payload);

      // Success: Redirect to the verification screen, passing the email and context
      showToast.success(
        "Code Sent",
        `A verification code has been sent to ${email}.`
      );

      router.replace({
        pathname: "/(auth)/OtpScreen",
        params: {
          context: "reset", // Context indicates this is for password reset
          email: email,
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("Forgot Password API Error:", axiosError.response?.data);

      let errorMessage =
        "Could not send verification code. Please check the email and try again.";

      // Handle common API errors (e.g., 400 Bad Request / 422 Unprocessable Entity)
      if (
        axiosError.response?.status === 400 ||
        axiosError.response?.status === 422
      ) {
        // General validation failure or email not found
        errorMessage = "The email address was not found or is invalid.";
        // Set error on the field for visual feedback
        setErrors({ email: errorMessage });
      }

      showToast.error("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
      // Style adjustment for visual impact
      fontSize: rfs(typography.heading1.fontSize),
      fontFamily: typography.heading1.fontFamily,
      color: colors.textPrimary,
      marginBottom: ms(spacing.lg), // Increased margin
      textAlign: "center",
    },
    description: {
      fontSize: rfs(typography.bodyMedium.fontSize),
      fontFamily: typography.bodyMedium.fontFamily,
      color: colors.textPrimary,
      marginBottom: ms(spacing.xl * 1.5), // Increased margin
      textAlign: "center",
    },
    loginLink: {
      fontSize: rfs(typography.bodySmall.fontSize),
      fontFamily: typography.bodySmall.fontFamily,
      color: colors.primary,
      textDecorationLine: "underline",
      alignSelf: "center",
      marginTop: ms(spacing.xl * 2), // Extra margin for separation
    },
  });

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.backgroundMain}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.backgroundMain }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.innerContainer}>
              <Text style={styles.header}>Forgot Password?</Text>

              <Text style={styles.description}>
                Enter the email address linked to your account. We will send you
                a verification code to reset your password.
              </Text>

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
                // Show success state if valid and no server error
                isValid={isEmailValid && !errors.email}
              />

              {/* Send Verification Code Button */}
              <PrimaryButton
                title={isLoading ? "SENDING..." : "Send Verification Code"}
                onPress={handleSendCode}
                isLoading={isLoading}
                // Button enabled only if the email is valid (client-side) and not loading
                disabled={!isEmailValid || isLoading}
              />

              {/* Back to Login Link */}
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/SignInScreen")}
              >
                <Text style={styles.loginLink}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}
