import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
} from 'react-native';
import { defaultTheme } from '../../../styles/index'; // Adjust path if needed
import { rbr, rw, rh } from '../../../styles/scaling'; // responsive scaling functions

interface ResetPasswordState {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordScreen: React.FC = () => {
  const [passwords, setPasswords] = useState<ResetPasswordState>({
    newPassword: '',
    confirmPassword: '',
  });

  const isFormValid = passwords.newPassword.length > 0 && passwords.confirmPassword.length > 0;

  const handleChange = (field: keyof ResetPasswordState, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetPassword = () => {
    const { newPassword, confirmPassword } = passwords;

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }

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
        onChangeText={(text) => handleChange('newPassword', text)}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor={defaultTheme.colors.textGrey2}
        secureTextEntry
        value={passwords.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[
          styles.button,
          !isFormValid && styles.buttonDisabled
        ]}
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
    marginBottom: defaultTheme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: defaultTheme.typography.bodyMedium.fontSize,
    fontFamily: defaultTheme.typography.bodyMedium.fontFamily,
    color: defaultTheme.colors.typographyextSecondary,
    marginBottom: defaultTheme.spacing.xl,
    textAlign: 'center',
  },
  input: {
    height: rh(7), // 7% of screen height
    width: rw(90), // 90% of screen width
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
