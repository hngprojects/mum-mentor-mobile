import React, { useState, useEffect, useMemo } from 'react';
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
import { AxiosError } from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


// --- Imports from Core Components and Styles ---
import CustomInput from '../components/CustomInput'; 
import PrimaryButton from '../components/PrimaryButton';
import { colors, typography, spacing  } from '../../core/styles/index';
import { rfs, ms, vs } from '../../core/styles/scaling'

// --- API Service and Types ---
import { register, RegisterPayload, ApiErrorResponse } from '../../core/services/authService'; 

// --- Password Validation Types ---
interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

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

  // --- Password Requirements State ---
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8, met: false },
    { label: 'At least one uppercase letter', test: (pwd) => /[A-Z]/.test(pwd), met: false },
    { label: 'At least one lowercase letter', test: (pwd) => /[a-z]/.test(pwd), met: false },
    { label: 'At least one number', test: (pwd) => /[0-9]/.test(pwd), met: false },
    { label: 'At least one special character (!@#$%^&*)', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), met: false },
  ]);

  // --- Update Password Requirements on Password Change ---
  useEffect(() => {
    const updatedRequirements = [
      { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8, met: password.length >= 8 },
      { label: 'At least one uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd), met: /[A-Z]/.test(password) },
      { label: 'At least one lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd), met: /[a-z]/.test(password) },
      { label: 'At least one number', test: (pwd: string) => /[0-9]/.test(pwd), met: /[0-9]/.test(password) },
      { label: 'At least one special character (!@#$%^&*)', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
    setPasswordRequirements(updatedRequirements);
  }, [password]);

  // --- Check if all password requirements are met ---
  const allPasswordRequirementsMet = useMemo(() => {
    return passwordRequirements.every(req => req.met);
  }, [passwordRequirements]);

  // --- Client-Side Validation Logic ---
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
      isValid = false;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Incorrect Email format.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (!allPasswordRequirementsMet) {
      newErrors.password = 'Password does not meet all requirements.';
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

    const payload: RegisterPayload = { 
      full_name: fullName.trim(), 
      email: email.toLowerCase(), 
      password: password,
      confirm_password: confirmPassword
    };

    // --- LIVE API CALL INTEGRATION ---
    try {
      await register(payload);

      // Success: Redirect to the verification screen, passing the email as a parameter
      Alert.alert("Success!", "Account created. Please check your email for the verification code.");
      
      // Navigate to the reusable verification screen, passing context and email
      router.replace({ 
        pathname: '/(auth)/OtpScreen', 
        params: { 
          context: 'register', 
          email: email 
        } 
      });

    } catch (error) {
      // --- SAFELY HANDLE AXIOS ERROR ---
      const axiosError = error as AxiosError<ApiErrorResponse>;
      let errorMessage = "Signup Failed. Please try again.";
      let apiErrors: { [key: string]: string } = {};

      // Safely check for the response data
      if (axiosError.response && axiosError.response.data) {
          const detail = axiosError.response.data.detail;
          
          if (typeof detail === 'string') {
              // Handle general 400/409 errors (e.g., "user already exists")
              if (detail.toLowerCase().includes('already exists') || detail.toLowerCase().includes('already registered')) {
                  apiErrors.email = "This email is already registered. Try logging in.";
              } else {
                  errorMessage = detail;
              }
          } else if (Array.isArray(detail)) {
              // Handle 422 validation errors with loc, msg structure
              detail.forEach((err: any) => {
                  const field = err.loc[err.loc.length - 1];
                  const message = err.msg;
                  
                  // Map API field names to state variable names
                  if (field === 'email') {
                      apiErrors.email = message;
                  } else if (field === 'password') {
                      apiErrors.password = message;
                  } else if (field === 'confirm_password') {
                      apiErrors.confirmPassword = message;
                  } else if (field === 'full_name') {
                      apiErrors.fullName = message;
                  }
              });
              errorMessage = "Please check your highlighted inputs.";
          }
      }
      
      // Update specific input errors or show a general alert
      if (Object.keys(apiErrors).length > 0) {
          setErrors(prev => ({...prev, ...apiErrors}));
      } else {
          Alert.alert("Signup Failed", errorMessage);
      }

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
                isValid={fullName.trim().length > 0 && !errors.fullName}
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

              {/* Choose Password Input */}
              <CustomInput
                label="Choose Password"
                placeholder={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
                value={password}
                onChangeText={setPassword}
                isPassword
                iconName="lock-outline"
                isError={!!errors.password}
                errorMessage={errors.password}
                isValid={allPasswordRequirementsMet && !errors.password}
              />

              {/* Password Requirements Display */}
              {password.length > 0 && (
                <View style={styles.passwordRequirementsContainer}>
                  <Text style={styles.requirementsTitle}>Password must contain:</Text>
                  {passwordRequirements.map((req, index) => (
                    <View key={index} style={styles.requirementRow}>
                      <View style={[
                        styles.requirementIndicator, 
                        req.met && styles.requirementIndicatorMet
                      ]}>
                        {req.met && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={[
                        styles.requirementText,
                        req.met && styles.requirementTextMet
                      ]}>
                        {req.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Confirm Password Input */}
              <CustomInput
                label="Confirm Password"
                placeholder="Enter same password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                iconName="lock-outline"
                isError={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
                isValid={confirmPassword.length > 0 && confirmPassword === password && allPasswordRequirementsMet && !errors.confirmPassword}
              />

              {/* Terms & Conditions */}
              <View style={styles.agreementContainer}>
                <TouchableOpacity 
                  onPress={() => setIsAgreed(!isAgreed)} 
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={isAgreed ? 'checkbox' : 'square-outline'}
                    size={rfs(24)}
                    color={isAgreed ? colors.success : (errors.agreement ? colors.error : colors.textPrimary)}
                  />
                </TouchableOpacity>
                <Text style={styles.agreementText}>
                  I agree to all the{' '}
                  <Text style={styles.termsLink} onPress={() => router.push('/TermsAndConditions')}>
                    Terms & Conditions
                  </Text>
                </Text>
              </View>

              {/* Sign Up Button */}
              <PrimaryButton
                title="Sign up"
                onPress={handleSignup}
                isLoading={isLoading}
                disabled={!isAgreed || isLoading}
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
    passwordRequirementsContainer: {
      backgroundColor: colors.backgroundSoft,
      borderRadius: ms(8),
      padding: ms(spacing.md),
      marginTop: ms(-spacing.sm),
      marginBottom: ms(spacing.md),
    },
    requirementsTitle: {
      fontSize: rfs(typography.caption.fontSize),
      fontFamily: typography.bodyMedium.fontFamily,
      color: colors.textGrey1,
      marginBottom: vs(8),
    },
    requirementRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: vs(6),
    },
    requirementIndicator: {
      width: ms(18),
      height: ms(18),
      borderRadius: ms(9),
      borderWidth: 2,
      borderColor: colors.textGrey2,
      marginRight: ms(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
    requirementIndicatorMet: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    checkmark: {
      color: colors.textWhite,
      fontSize: rfs(12),
      fontWeight: 'bold',
    },
    requirementText: {
      fontSize: rfs(typography.caption.fontSize),
      fontFamily: typography.bodySmall.fontFamily,
      color: colors.textGrey2,
      flex: 1,
    },
    requirementTextMet: {
      color: colors.success,
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