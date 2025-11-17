import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, // Import TouchableOpacity for custom styling
  Dimensions, // Used for responsive width
} from 'react-native';

// Get screen width for input sizing
const { width } = Dimensions.get('window');

// Define the component's state interface
interface ResetPasswordState {
  newPassword: string;
  confirmPassword: string;
}

// Define the component itself
const ResetPasswordScreen: React.FC = () => {
  const [passwords, setPasswords] = useState<ResetPasswordState>({
    newPassword: '',
    confirmPassword: '',
  });

  // Derived state to check if both fields have content
  const isFormValid = passwords.newPassword.length > 0 && passwords.confirmPassword.length > 0;
  
  // Handler for input changes
  const handleChange = (field: keyof ResetPasswordState, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler for button press
  const handleResetPassword = () => {
    const { newPassword, confirmPassword } = passwords;

    // 1. Validation: Check if passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match.");
      return;
    }

    // 2. Validation: Check minimum length
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }

    // --- Placeholder for your actual API call ---
    
    // In a real app, you would call your API service function here:
    // resetPasswordService(token, newPassword) 
    //   .then(() => Alert.alert('Success', 'Your password has been reset!'))
    //   .catch(error => Alert.alert('Error', 'Failed to reset password.'));

    Alert.alert('Password Reset', 'New password submitted successfully!');
    
    // Clear the fields after a successful attempt (or navigate away)
    setPasswords({ newPassword: '', confirmPassword: '' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>
        Enter your new password below.
      </Text>

      {/* Input for New Password */}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#999"
        secureTextEntry={true}
        value={passwords.newPassword}
        onChangeText={(text) => handleChange('newPassword', text)}
        autoCapitalize="none"
      />

      {/* Input for Confirm Password */}
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor="#999"
        secureTextEntry={true}
        value={passwords.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        autoCapitalize="none"
      />

      {/* Red Button using TouchableOpacity */}
      <TouchableOpacity
        style={[
          styles.button, 
          !isFormValid && styles.buttonDisabled // Apply disabled style if form is not valid
        ]}
        onPress={handleResetPassword}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: '#f5f5f5', // Light gray background
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%', // Use full width
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    // Primary Red Color
    backgroundColor: '#E74C3C', // A standard, visible red
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonDisabled: {
    // Lighter red/grayed out when disabled
    backgroundColor: '#F1948A', 
  }
});

export default ResetPasswordScreen;