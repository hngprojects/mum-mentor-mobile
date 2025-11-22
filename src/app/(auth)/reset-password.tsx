// src/app/(auth)/reset-password.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultTheme } from '../../core/styles/index';
import { rw, rh, rfs, rbr } from '../../core/styles/scaling';

const ResetPasswordScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const passwordsMatch =
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleResetPassword = () => {
    if (passwordsMatch) setShowSuccess(true);
  };

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>Reset Password</Text>

      {/* NEW PASSWORD */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>New Password</Text>

        <View
          style={[
            styles.inputWrapper,
            newPassword.length >= 8 ? styles.successBorder : null,
            newPassword.length > 0 && newPassword.length < 8
              ? styles.errorBorder
              : null,
          ]}
        >
          {/* PADLOCK */}
          <Icon
            name="lock-closed-outline"
            size={20}
            color={defaultTheme.colors.textGrey2}
            style={styles.leftIcon}
          />

          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor={defaultTheme.colors.textGrey2}
            secureTextEntry={!showNew}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          {/* EYE ICON */}
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Icon
              name={showNew ? 'eye' : 'eye-off'}
              size={22}
              color={defaultTheme.colors.textGrey2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONFIRM PASSWORD */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Confirm Password</Text>

        <View
          style={[
            styles.inputWrapper,
            confirmPassword.length >= 8 &&
            confirmPassword === newPassword
              ? styles.successBorder
              : null,
            confirmPassword.length > 0 &&
            confirmPassword !== newPassword
              ? styles.errorBorder
              : null,
          ]}
        >
          {/* PADLOCK */}
          <Icon
            name="lock-closed-outline"
            size={20}
            color={defaultTheme.colors.textGrey2}
            style={styles.leftIcon}
          />

          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor={defaultTheme.colors.textGrey2}
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Icon
              name={showConfirm ? 'eye' : 'eye-off'}
              size={22}
              color={defaultTheme.colors.textGrey2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* RESET BUTTON */}
      <TouchableOpacity
        style={[styles.button, !passwordsMatch && styles.buttonDisabled]}
        disabled={!passwordsMatch}
        onPress={handleResetPassword}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      {/* SUCCESS MODAL */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.successCircle}>
              <Icon name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.successText}>Password reset successfully</Text>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowSuccess(false)}
            >
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ====================== STYLES ====================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.backgroundMain,
    paddingHorizontal: defaultTheme.spacing.lg,
    paddingTop: rh(8),
    alignItems: 'center',
  },

  /* 🔥 HANKEN GROTESK BOLD */
  title: {
    fontSize: rfs(22),
    fontFamily: 'HankenGrotesk-Bold',
    color: defaultTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: rh(5),
  },

  fieldContainer: {
    width: '100%',
    marginBottom: rh(3),
  },

  /* 🔥 HANKEN GROTESK REGULAR */
  label: {
    fontSize: rfs(14),
    fontFamily: 'HankenGrotesk-Regular',
    color: defaultTheme.colors.textPrimary,
    marginBottom: rh(0.8),
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.3,
    borderColor: defaultTheme.colors.outline,
    borderRadius: rbr(10),
    paddingHorizontal: defaultTheme.spacing.md,
    height: rh(7),
    width: '100%',
  },

  leftIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: rfs(14),
    fontFamily: 'HankenGrotesk-Regular',
    color: defaultTheme.colors.textPrimary,
    paddingVertical: 0,
  },

  successBorder: {
    borderColor: defaultTheme.colors.success,
  },
  errorBorder: {
    borderColor: defaultTheme.colors.error,
  },

  button: {
    width: '100%',
    backgroundColor: defaultTheme.colors.primary,
    paddingVertical: rh(1.8),
    borderRadius: rbr(10),
    alignItems: 'center',
    marginTop: rh(3),
  },
  buttonDisabled: {
    backgroundColor: defaultTheme.colors.primaryLight,
  },

  buttonText: {
    color: '#fff',
    fontSize: rfs(15),
    fontFamily: 'HankenGrotesk-Bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: rw(80),
    backgroundColor: '#fff',
    padding: rh(4),
    borderRadius: rbr(14),
    alignItems: 'center',
  },

  successCircle: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: defaultTheme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rh(2),
  },

  successText: {
    fontSize: rfs(15),
    fontFamily: 'HankenGrotesk-Regular',
    color: defaultTheme.colors.textPrimary,
    marginBottom: rh(3),
  },

  backButton: {
    width: rw(60),
    paddingVertical: rh(1.6),
    backgroundColor: defaultTheme.colors.primary,
    borderRadius: rbr(10),
    alignItems: 'center',
  },

  backText: {
    color: '#fff',
    fontSize: rfs(15),
    fontFamily: 'HankenGrotesk-Bold',
  },
});

export default ResetPasswordScreen;
