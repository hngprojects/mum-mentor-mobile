import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Theme and Utilities ---
import { defaultTheme } from '../../core/styles/index';
import { ms, vs, rfs } from '../../core/styles/scaling';

// --- Components ---
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';

// --- API Service ---
import { resetPassword, ApiErrorResponse } from '../../core/services/authService';
import { AxiosError } from 'axios';

// Destructure theme values outside component to prevent re-renders
const { colors, typography } = defaultTheme;

export default function ResetPassword() {
  const params = useLocalSearchParams<{ verificationToken: string; email: string }>();
  const verificationToken = params.verificationToken;
  const email = params.email;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Password validation states
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setNewPasswordError('Password must be at least 8 characters');
      return false;
    }
    setNewPasswordError('');
    return true;
  };

  const validateConfirmPassword = (): boolean => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleResetPassword = async () => {
    // Validate inputs
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmValid = validateConfirmPassword();

    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    if (!verificationToken) {
      Alert.alert('Error', 'Verification token is missing. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        token: verificationToken,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      await resetPassword(payload);

      // Show success modal
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if ((error as any).isAxiosError) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        errorMessage = axiosError.response?.data?.message 
          || (typeof axiosError.response?.data?.detail === 'string' ? axiosError.response.data.detail : errorMessage);
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/SignInScreen');
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
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Create a new password for your account
        </Text>

        <View style={styles.inputWrapper}>
          <CustomInput
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              if (newPasswordError) validatePassword(text);
            }}
            iconName="lock-outline"
            isPassword={true}
            secureTextEntry={true}
            isError={!!newPasswordError}
            errorMessage={newPasswordError}
          />
        </View>

        <View style={styles.inputWrapper}>
          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError && newPassword === text) {
                setConfirmPasswordError('');
              }
            }}
            iconName="lock-outline"
            isPassword={true}
            secureTextEntry={true}
            isError={!!confirmPasswordError}
            errorMessage={confirmPasswordError}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title={isLoading ? 'RESETTING...' : 'Reset Password'}
            onPress={handleResetPassword}
            isLoading={isLoading}
            disabled={!newPassword || !confirmPassword || isLoading}
          />
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark"
                size={ms(48)}
                color={colors.textWhite}
              />
            </View>
            <Text style={styles.modalTitle}>Password reset successful!</Text>
            <Text style={styles.modalSubtitle}>
              Your password has been successfully reset. You can now log in with your new password.
            </Text>
            <PrimaryButton
              title="Back to Login"
              onPress={handleSuccessModalClose}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// Styles created outside component with destructured theme values
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: ms(24),
    paddingTop: vs(60),
    paddingBottom: vs(40),
  },
  title: {
    ...typography.heading1,
    color: colors.textPrimary,
    marginBottom: vs(8),
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    marginBottom: vs(32),
  },
  inputWrapper: {
    marginBottom: vs(20),
  },
  buttonWrapper: {
    marginTop: vs(24),
  },
  // Success Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    padding: ms(24),
    alignItems: 'center',
    width: '85%',
    maxWidth: ms(400),
  },
  successIcon: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  modalTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: vs(8),
    textAlign: 'center',
  },
  modalSubtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: 'center',
    marginBottom: vs(24),
  },
  modalButton: {
    width: '100%',
  },
});