import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { defaultTheme } from '../../../theme/constants';

const { width } = Dimensions.get('window');

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
        placeholderTextColor={defaultTheme.colors.text_grey_2}
        secureTextEntry
        value={passwords.newPassword}
        onChangeText={(text) => handleChange('newPassword', text)}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor={defaultTheme.colors.text_grey_2}
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
    backgroundColor: defaultTheme.colors.background_main,
    justifyContent: 'center',
  },
  title: {
    fontSize: defaultTheme.typography.H1.size,
    fontFamily: defaultTheme.typography.H1.weight,
    color: defaultTheme.colors.text_primary,
    marginBottom: defaultTheme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: defaultTheme.typography.body_regular.size,
    fontFamily: defaultTheme.typography.body_regular.weight,
    color: defaultTheme.colors.text_secondary,
    marginBottom: defaultTheme.spacing.xl,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: defaultTheme.colors.background_soft,
    borderColor: defaultTheme.colors.outline,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: defaultTheme.spacing.md,
    fontSize: defaultTheme.typography.body_regular.size,
    fontFamily: defaultTheme.typography.body_regular.weight,
    color: defaultTheme.colors.text_primary,
  },
  button: {
    backgroundColor: defaultTheme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: defaultTheme.spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: defaultTheme.colors.text_white,
    fontWeight: 'bold',
    fontSize: defaultTheme.typography.buttonText.size,
    fontFamily: defaultTheme.typography.buttonText.weight,
  },
  buttonDisabled: {
    backgroundColor: defaultTheme.colors.primary_light,
  },
});

export default ResetPasswordScreen;
