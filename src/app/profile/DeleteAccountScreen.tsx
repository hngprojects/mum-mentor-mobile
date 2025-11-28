// src/screens/DeleteAccountScreen.tsx

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/src/core/styles';
import { ms, rbr, vs } from '@/src/core/styles/scaling';
import { router } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';

const checkedIcon = require('@/src/assets/images/checkbox_checked.png');
const uncheckedIcon = require('@/src/assets/images/checkbox_unchecked.png');

const reasons = [
  "I don't use this account anymore",
  'I have another account',
  "I'm not satisfied with the service",
  'I no longer need the app',
  "I'm taking a break",
  "I'm switching to a different platform",
  "I didn't find what I was looking for",
  "I'm worried about how my data is used",
  'I had a security concern or issue',
  'I want to remove my personal information',
  'Others',
];

const DeleteAccountScreen = () => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
      // Clear other reason text if unchecking "Others"
      if (reason === 'Others') {
        setOtherReason('');
      }
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Your delete account API call here
      router.push('/profile/ConfirmDelete')
      if (selectedReasons.includes('Others')) {
      }
      // await deleteAccountAPI(selectedReasons, otherReason);
      // router.replace('/account-deleted'); // Navigate to success screen
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    const isChecked = selectedReasons.includes(item);

    return (
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => toggleReason(item)}
          activeOpacity={0.7}
        >
          <Image
            source={isChecked ? checkedIcon : uncheckedIcon}
            style={styles.checkbox}
          />
          <Text style={styles.label}>{item}</Text>
        </TouchableOpacity>

        {/* Show TextArea when "Others" is selected */}
        {item === 'Others' && isChecked && (
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Please tell us more about your reason..."
              placeholderTextColor={colors.textGrey2}
              value={otherReason}
              onChangeText={setOtherReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        )}
      </View>
    );
  };

  const hasSelectedReasons = selectedReasons.length > 0;
  const buttonTitle = hasSelectedReasons ? 'Delete' : 'Continue';
  // const isDeleteDisabled =
  //   !hasSelectedReasons ||
  //   (selectedReasons.includes('Others') && !otherReason.trim()) ||
  //   isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delete Account</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Warning Text */}
        <View style={styles.deleteTextContainer}>
          <Text style={styles.deleteText}>
            Deleting your account will permanently remove your data and cannot be
            undone. Please confirm your reason before proceeding.
          </Text>
        </View>

        {/* Reasons List */}
        <FlatList
          data={reasons}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />

        {/* Continue/Delete Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={buttonTitle}
            onPress={handleDelete}
            isLoading={isLoading}
            // disabled={isDeleteDisabled}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    paddingTop: vs(50),
    paddingBottom: vs(16),
    backgroundColor: colors.backgroundMain,
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    flex: 1,
  },
  headerSpacer: {
    width: ms(40),
  },
  deleteTextContainer: {
    marginHorizontal: ms(20),
    marginTop: vs(12),
    marginBottom: vs(20),
  },
  deleteText: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: ms(20),
    paddingBottom: vs(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(14),
  },
  checkbox: {
    width: ms(24),
    height: ms(24),
    marginRight: ms(12),
    resizeMode: 'contain',
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  textAreaContainer: {
    marginTop: vs(8),
    marginBottom: vs(12),
  },
  textArea: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    backgroundColor: colors.textWhite,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: rbr(10),
    padding: ms(12),
    minHeight: vs(100),
    maxHeight: vs(150),
  },
  buttonContainer: {
    paddingHorizontal: ms(20),
    paddingVertical: vs(16),
    backgroundColor: colors.backgroundMain,
  },
});