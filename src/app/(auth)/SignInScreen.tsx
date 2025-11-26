// src/screens/auth/SignInScreen.tsx

import { AxiosError } from "axios";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Imports from Core Components and Styles ---
import { colors, spacing, typography } from "../../core/styles/index";
import { ms, rfs } from "../../core/styles/scaling";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";

// --- API Service Import ---
import {
  isAppleAuthAvailable,
  signInWithApple,
} from "@/src/core/services/appleAuthService";
import { signInWithGoogle } from "@/src/core/services/googleAuthservice";
import { showToast } from "@/src/core/utils/toast";
import { ApiErrorResponse, login } from "../../core/services/authService";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);

  // Check if Apple Sign-In is available
  useEffect(() => {
    const checkAppleAuth = async () => {
      const available = await isAppleAuthAvailable();
      setIsAppleAvailable(available);
    };
    checkAppleAuth();
  }, []);

  // Helper to redirect after login
  const redirectAfterLogin = async () => {
    try {
      const isSetupComplete = await AsyncStorage.getItem("isSetupComplete");
      if (isSetupComplete === "true") {
        router.replace("/(tabs)/Home");
      } else {
        router.replace("/setup/Mum");
      }
    } catch (err) {
      console.error("Error reading setup status:", err);
      router.replace("/(tabs)/Home"); // fallback
    }
  };

  // Handle Apple Sign-In
  const handleApplePress = async () => {
    setIsAppleLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      const result = await signInWithApple();

      if (result.success) {
        showToast.success(
          "Welcome Back!",
          result.user?.name
            ? `Signed in as ${result.user.name}`
            : "Apple login successful."
        );
        await redirectAfterLogin();
      } else {
        setGeneralError(
          result.error || "Apple sign in failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Apple sign in error:", error);
      setGeneralError("Apple sign in failed. Please try again.");
    } finally {
      setIsAppleLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGooglePress = async () => {
    setIsGoogleLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      const result = await signInWithGoogle();

      if (result.success) {
        showToast.success(
          "Welcome Back!",
          result.user
            ? `Signed in as ${result.user.name}`
            : "Google login successful."
        );
        await redirectAfterLogin();
      } else {
        setGeneralError(
          result.error || "Google sign in failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      setGeneralError("Google sign in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // --- Validation Logic ---
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!email || !email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    setGeneralError(null);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      const loginPayload = { email: email.toLowerCase(), password };
      await login(loginPayload);

      showToast.success("Welcome Back!", "Login successful.");
      await redirectAfterLogin();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const statusCode = axiosError.response?.status;

      console.warn(
        "Login API Failure (Expected):",
        statusCode,
        axiosError.response?.data
      );

      if (statusCode === 401 || statusCode === 404) {
        setErrors({
          email: "The Email Address is incorrect or user not found.",
          password: "The Password is incorrect.",
        });
        setGeneralError(null);
      } else if (statusCode === 422) {
        setGeneralError("Validation failed. Check input formats.");
        setErrors({});
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
        setErrors({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Navigation Handlers ---
  const handleForgotPassword = () => router.push("/(auth)/ForgotPasswordScreen");
  const handleSignUp = () => router.replace("/(auth)/SignUpScreen");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Log In</Text>

          {generalError && (
            <Text style={styles.generalErrorText}>{generalError}</Text>
          )}

          <CustomInput
            label="Email"
            placeholder="Enter Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            isError={!!errors.email}
            errorMessage={errors.email}
            iconName="mail-outline"
            isValid={email.includes("@") && email.length > 0 && !errors.email}
          />

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

          <TouchableOpacity
            style={styles.forgotPasswordLink}
            onPress={handleForgotPassword}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Log In"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={!email || !password || isLoading}
          />

          <Text style={styles.signupText}>
            Don&apos;t have an account?{" "}
            <Text style={styles.signupLink} onPress={handleSignUp}>
              Sign up
            </Text>
          </Text>

          <Text style={styles.socialLoginText}>OR CONTINUE WITH</Text>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGooglePress}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Image
                    source={require("../../assets/images/google.png")}
                    style={styles.socialButtonImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.socialButtonText}>Google</Text>
                </>
              )}
            </TouchableOpacity>

            {isAppleAvailable && (
              <TouchableOpacity
                style={[styles.socialButton, { marginLeft: ms(spacing.md) }]}
                onPress={handleApplePress}
                disabled={isAppleLoading}
              >
                {isAppleLoading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <Image
                      source={require("../../assets/images/apple.png")}
                      style={styles.socialButtonImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialButtonText}>Apple</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
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
    textAlign: "center",
    fontSize: rfs(typography.heading1.fontSize),
    fontFamily: typography.heading1.fontFamily,
    color: colors.textPrimary,
    marginBottom: ms(spacing.xl * 2),
  },
  generalErrorText: {
    ...typography.bodyMedium,
    color: colors.error,
    textAlign: "center",
    marginBottom: ms(spacing.md),
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: ms(-spacing.md),
    marginBottom: ms(spacing.xl),
  },
  forgotPasswordText: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  signupText: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: ms(spacing.lg),
    marginBottom: ms(spacing.lg),
  },
  signupLink: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  socialLoginText: {
    fontSize: rfs(typography.caption.fontSize),
    fontFamily: typography.caption.fontFamily,
    color: colors.textGrey1,
    textAlign: "center",
    marginVertical: ms(spacing.md),
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  },
});
