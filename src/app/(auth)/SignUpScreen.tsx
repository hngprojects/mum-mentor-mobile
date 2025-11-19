// src/features/authentication/screens/SignUpScreen.tsx

import React, { useState } from 'react';
import { 
  View, 
  Text,
  Image,
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';

// --- Imports from Core Components and Styles ---
import CustomInput from '../components/CustomInput'; 
import PrimaryButton from '../components/PrimaryButton';
import { colors, typography, spacing } from '../../core/styles/index'; 
import { ms, rfs } from '../../core/styles/scaling';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Constants for Validation ---
const MIN_PASSWORD_LENGTH = 8;

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- Validation Logic ---
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!fullName) {
      newErrors.fullName = 'Full Name is required.';
      isValid = false;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Incorrect Email format.';
      isValid = false;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Must meet minimum of ${MIN_PASSWORD_LENGTH} characters.`;
      isValid = false;
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }
    if (!isAgreed) {
      newErrors.agreement = 'You must agree to the Terms & Conditions.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert("Success!", "Account created. Redirecting to Mom Setup.");
      router.replace('./(tabs)/Home'); 
    } catch (error) {
      Alert.alert("Signup Failed", "Could not create account. Please try again.");
      console.error("Signup API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundMain} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.backgroundMain }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.innerContainer}>
              <Text style={styles.header}>Sign up</Text>

              {/* Full Name Input */}
              <CustomInput
                label="Full Name"
                placeholder="Enter Full Name"
                value={fullName}
                onChangeText={setFullName}
                isError={!!errors.fullName}
                errorMessage={errors.fullName}
                iconName="person-outline"
                isValid={fullName.length > 0 && !errors.fullName}
              />

              {/* Email Input */}
              <CustomInput
                label="Email Address"
                placeholder="Enter Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                isError={!!errors.email}
                errorMessage={errors.email}
                iconName="mail-outline"
                isValid={email.includes('@') && email.includes('.') && !errors.email}
              />

              {/* Password Input */}
              <CustomInput
                label="Choose Password"
                placeholder={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
                value={password}
                onChangeText={setPassword}
                isPassword
                iconName="lock-outline"
                isError={!!errors.password}
                errorMessage={errors.password}
                isValid={password.length >= MIN_PASSWORD_LENGTH && !errors.password}
              />

              <CustomInput
                label="Confirm Password"
                placeholder="Enter same password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                iconName="lock-outline"
                isError={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
                isValid={confirmPassword === password && password.length >= MIN_PASSWORD_LENGTH && !errors.confirmPassword}
              />

              {/* Terms & Conditions */}
              <View style={styles.agreementContainer}>
                <TouchableOpacity 
                  onPress={() => setIsAgreed(!isAgreed)} 
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image
                    source={
                      isAgreed
                        ? require('../../assets/images/checkbox_checked.png')
                        : require('../../assets/images/checkbox_unchecked.png')
                    }
                    style={{
                      width: rfs(24),
                      height: rfs(24),
                      borderRadius: rfs(6),
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.agreementText}>
                  I agree to all the{' '}
                  <Text style={styles.termsLink} onPress={() => Alert.alert('Terms & Conditions')}>
                    Terms & Conditions
                  </Text>
                </Text>
              </View>

              {/* Sign Up Button */}
              <PrimaryButton
                title="Sign up"
                onPress={handleSignup}
                isLoading={isLoading}
                disabled={!isAgreed}
              />

              {/* Already Have Account */}
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text 
                  style={styles.loginLink} 
                  onPress={() => router.replace('/(auth)/SignInScreen')}
                >
                  Login
                </Text>
              </Text>

              <Text style={styles.socialLoginText}>OR CONTINUE WITH</Text>

              {/* Social Login Buttons */}
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
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
    paddingTop: ms(spacing.xl),
    paddingBottom: ms(spacing.xl),
  },
  header: {
    fontSize: rfs(typography.heading1.fontSize),
    fontFamily: typography.heading1.fontFamily,
    color: colors.textPrimary,
    marginBottom: ms(spacing.xl),
    textAlign: 'center',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: ms(spacing.xl),
    marginTop: ms(spacing.sm),
    borderRadius: ms(15),
  },
  agreementText: {
    fontSize: rfs(typography.bodySmall.fontSize),
    fontFamily: typography.bodySmall.fontFamily,
    color: colors.textPrimary,
    marginLeft: ms(spacing.sm),
    flexShrink: 1,
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  loginText: {
    fontSize: rfs(typography.bodyMedium.fontSize),
    fontFamily: typography.bodyMedium.fontFamily,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: ms(spacing.lg),
    marginBottom: ms(spacing.lg),
  },
  loginLink: {
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.outline,
    paddingVertical: ms(spacing.sm),
    paddingHorizontal: ms(40),
    borderRadius: ms(spacing.sm),
    alignItems: 'center',
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
