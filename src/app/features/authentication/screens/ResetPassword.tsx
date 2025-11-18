import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { defaultTheme } from '../../../styles/index';
import { rbr, rw, rh } from '../../../styles/scaling';

interface ResetPasswordState {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordScreen: React.FC = () => {
  const [passwords, setPasswords] = useState<ResetPasswordState>({
    newPassword: '',
    confirmPassword: '',
  });

  // Strong password regex (uppercase, lowercase, number, special character, 12 chars min)
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

  const isFormValid =
    strongPasswordRegex.test(passwords.newPassword) &&
    passwords.newPassword === passwords.confirmPassword;

  const handleChange = (field: keyof ResetPasswordState, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetPassword = async () => {
    const { newPassword, confirmPassword } = passwords;

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match.");
      return;
    }

    if (!strongPasswordRegex.test(newPassword)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 12 characters and include:\n• Uppercase letter\n• Lowercase letter\n• Number\n• Special character'
      );
      return;
    }

    // TODO: API INTEGRATION
    // Example:
    // await api.resetPassword({ token, newPassword })

    Alert.alert('Success', 'Password reset successfully!');

    setPasswords({ newPassword: '', confirmPassword: '' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>Enter your new password below.</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor={defaultTheme.colors.textGrey2}
        secureTextEntry
        value={passwords.newPassword}
        onChangeText={text => handleChange('newPassword', text)}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor={defaultTheme.colors.textGrey2}
        secureTextEntry
        value={passwords.confirmPassword}
        onChangeText={text => handleChange('confirmPassword', text)}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: defaultTheme.spacing.lg,
    backgroundColor: defaultTheme.colors.backgroundMain,
    justifyContent: 'center',
  },
  title: {
    fontSize: defaultTheme.typography.heading1.fontSize,
    fontFamily: defaultTheme.typography.heading1.fontFamily,
    color: defaultTheme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: defaultTheme.spacing.sm,
  },
  subtitle: {
    fontSize: defaultTheme.typography.bodyMedium.fontSize,
    fontFamily: defaultTheme.typography.bodyMedium.fontFamily,
    color: defaultTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: defaultTheme.spacing.xl,
  },
  input: {
    height: rh(7),
    width: rw(90),
    backgroundColor: defaultTheme.colors.backgroundSoft,
    borderColor: defaultTheme.colors.outline,
    borderWidth: 1,
    borderRadius: rbr(8),
    paddingHorizontal: defaultTheme.spacing.md,
    marginBottom: defaultTheme.spacing.md,
    fontSize: defaultTheme.typography.bodyMedium.fontSize,
    fontFamily: defaultTheme.typography.bodyMedium.fontFamily,
    color: defaultTheme.colors.textPrimary,
  },
  button: {
    backgroundColor: defaultTheme.colors.primary,
    padding: defaultTheme.spacing.md,
    borderRadius: rbr(8),
    alignItems: 'center',
    marginTop: defaultTheme.spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: defaultTheme.colors.textWhite,
    fontSize: defaultTheme.typography.buttonText.fontSize,
    fontFamily: defaultTheme.typography.buttonText.fontFamily,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: defaultTheme.colors.primaryLight,
  },
});

export default ResetPasswordScreen;
