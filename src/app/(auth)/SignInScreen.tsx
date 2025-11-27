import { router } from "expo-router";
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
import { colors, spacing, typography } from "@/src/core/styles";
import { ms, rfs } from "@/src/core/styles/scaling";
import CustomInput from "../components/CustomInput";
import PrimaryButton from "../components/PrimaryButton";
import { showToast } from "@/src/core/utils/toast";
import { signInWithGoogle } from "@/src/core/services/googleAuthservice";
import { isAppleAuthAvailable, signInWithApple } from "@/src/core/services/appleAuthService";
import { login, ApiErrorResponse } from "../../core/services/authService";
import { getProfileSetup } from "../../core/services/profileSetup.service";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const available = await isAppleAuthAvailable();
      setIsAppleAvailable(available);
    })();
  }, []);

  const redirectAfterLogin = async () => {
    try {
      const profile = await getProfileSetup();
      if (profile?.id) router.replace("/(tabs)/Home");
      else router.replace("/setup/Mum");
    } catch (err) {
      console.error("Error fetching profile setup:", err);
      router.replace("/setup/Mum");
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!email || !email.includes("@")) {
      newErrors.email = "Please enter a valid email.";
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
      await login({ email: email.toLowerCase(), password });
      showToast.success("Welcome Back!", "Login successful.");
      await redirectAfterLogin();
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        setErrors({ email: "Email not found.", password: "Incorrect password." });
      } else if (error.response?.status === 422) {
        setGeneralError("Validation failed. Check your input.");
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGooglePress = async () => {
    setIsGoogleLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        showToast.success("Welcome Back!", `Signed in as ${result.user?.name}`);
        await redirectAfterLogin();
      } else setGeneralError(result.error || "Google sign in failed.");
    } catch (error) {
      console.error(error);
      setGeneralError("Google sign in failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleApplePress = async () => {
    setIsAppleLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      const result = await signInWithApple();
      if (result.success) {
        showToast.success("Welcome Back!", `Signed in as ${result.user?.name}`);
        await redirectAfterLogin();
      } else setGeneralError(result.error || "Apple sign in failed.");
    } catch (error) {
      console.error(error);
      setGeneralError("Apple sign in failed.");
    } finally {
      setIsAppleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Log In</Text>

          {generalError && <Text style={styles.generalErrorText}>{generalError}</Text>}

          <CustomInput
            label="Email"
            placeholder="Enter Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            isError={!!errors.email}
            errorMessage={errors.email}
          />

          <CustomInput
            label="Password"
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            isPassword
            isError={!!errors.password}
            errorMessage={errors.password}
          />

          <TouchableOpacity onPress={() => router.push("/(auth)/ForgotPasswordScreen")}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <PrimaryButton title="Log In" onPress={handleLogin} isLoading={isLoading} disabled={!email || !password || isLoading} />

          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink} onPress={() => router.replace("/(auth)/SignUpScreen")}>
              Sign up
            </Text>
          </Text>

          <Text style={styles.socialLoginText}>OR CONTINUE WITH</Text>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGooglePress} disabled={isGoogleLoading}>
              {isGoogleLoading ? <ActivityIndicator size="small" color={colors.primary} /> : (
                <>
                  <Image source={require("../../assets/images/google.png")} style={styles.socialButtonImage} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </>
              )}
            </TouchableOpacity>

            {isAppleAvailable && (
              <TouchableOpacity style={[styles.socialButton, { marginLeft: ms(spacing.md) }]} onPress={handleApplePress} disabled={isAppleLoading}>
                {isAppleLoading ? <ActivityIndicator size="small" color={colors.primary} /> : (
                  <>
                    <Image source={require("../../assets/images/apple.png")} style={styles.socialButtonImage} />
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
  container: { flexGrow: 1, backgroundColor: colors.backgroundMain },
  innerContainer: { flex: 1, paddingHorizontal: ms(spacing.lg), paddingTop: ms(spacing.xl * 2), paddingBottom: ms(spacing.xl) },
  header: { textAlign: "center", fontSize: rfs(typography.heading1.fontSize), fontFamily: typography.heading1.fontFamily, color: colors.textPrimary, marginBottom: ms(spacing.xl * 2) },
  generalErrorText: { ...typography.bodyMedium, color: colors.error, textAlign: "center", marginBottom: ms(spacing.md) },
  forgotPasswordText: { textAlign: "right", color: colors.primary, textDecorationLine: "underline", marginBottom: ms(spacing.xl) },
  signupText: { fontSize: rfs(typography.bodyMedium.fontSize), color: colors.textPrimary, textAlign: "center", marginTop: ms(spacing.lg), marginBottom: ms(spacing.lg) },
  signupLink: { color: colors.primary, textDecorationLine: "underline", fontWeight: "bold" },
  socialLoginText: { fontSize: rfs(typography.caption.fontSize), color: colors.textGrey1, textAlign: "center", marginVertical: ms(spacing.md) },
  socialButtonsContainer: { flexDirection: "row", justifyContent: "space-between" },
  socialButton: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.outline, paddingVertical: ms(spacing.sm), borderRadius: ms(spacing.sm), marginHorizontal: ms(spacing.xs), minHeight: ms(50) },
  socialButtonImage: { width: rfs(24), height: rfs(24), marginRight: ms(spacing.sm) },
  socialButtonText: { fontSize: rfs(typography.bodyMedium.fontSize), color: colors.textPrimary },
});
