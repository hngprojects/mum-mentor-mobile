import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { colors, spacing, typography } from '../../core/styles/index';
import { ms } from '../../core/styles/scaling';
import CategoryChips from './CategoryChips';
import CustomInput from './CustomInput';
import MoodSelector from './MoodSelector';
import PhotoUploader, { UploadedPhoto } from './PhotoUploader';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface JournalEntry {
  id?: string;
  title: string;
  date: string;
  categories: string[];
  mood: string | null;
  photos: UploadedPhoto[];
  thoughts: string;
}

interface JournalEntryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  initialData?: JournalEntry;
  isLoading?: boolean;
}

const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState<Date>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categories || []
  );
  const [selectedMood, setSelectedMood] = useState<string | null>(
    initialData?.mood || null
  );
  const [photos, setPhotos] = useState<UploadedPhoto[]>(
    initialData?.photos || []
  );
  const [thoughts, setThoughts] = useState(initialData?.thoughts || '');

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(selectedMood === mood ? null : mood);
  };

  const handleDateConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setIsDatePickerVisible(false);
  };

  const handleDateCancel = () => {
    setIsDatePickerVisible(false);
  };

  const formatDate = (dateObj: Date): string => {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const entry: JournalEntry = {
      id: initialData?.id || Date.now().toString(),
      title: title.trim(),
      date: date.toISOString().split('T')[0],
      categories: selectedCategories,
      mood: selectedMood,
      photos,
      thoughts: thoughts.trim(),
    };

    onSave(entry);
  };

  const handleClose = () => {
    // Reset form when closing
    setTitle(initialData?.title || '');
    setDate(initialData?.date ? new Date(initialData.date) : new Date());
    setSelectedCategories(initialData?.categories || []);
    setSelectedMood(initialData?.mood || null);
    setPhotos(initialData?.photos || []);
    setThoughts(initialData?.thoughts || '');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleClose}
            disabled={isLoading}
          >
            <Image source={require('../../assets/images/arrow.png')} style={styles.arrowImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {initialData ? 'Edit Entry' : 'New Entry'}
          </Text>
        </View>

        {/* Form Content */}
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title Input */}
          <CustomInput
            label="Title"
            placeholder="First Steps!"
            value={title}
            onChangeText={setTitle}
            iconName="person-outline"
          />

          {/* Date Input */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsDatePickerVisible(true)}
            style={styles.dateInputWrapper}
          >
            <View pointerEvents="none">
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateInputLabel}>Date</Text>
                <View style={styles.dateInputField}>
                  <Text style={styles.dateInputText}>{formatDate(date)}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Category Selection */}
          <CategoryChips
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
          />

          {/* Mood Selection */}
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
          />

          {/* Photos */}
          <PhotoUploader photos={photos} onPhotosChange={setPhotos} />

          {/* Thoughts/Content - TextInput directly in form */}
          <View style={styles.thoughtsContainer}>
            <Text style={styles.thoughtsLabel}>Your Thoughts</Text>
            <View style={styles.thoughtsInputWrapper}>
              <TextInput
                style={styles.thoughtsInput}
                placeholder="Write about what you like to remember later..."
                placeholderTextColor={colors.textGrey2}
                value={thoughts}
                onChangeText={setThoughts}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={isLoading ? 'Saving...' : 'Save'}
              onPress={handleSave}
              disabled={isLoading}
            />
            <SecondaryButton
              title="Cancel"
              onPress={handleClose}
              disabled={isLoading}
            />
          </View>
        </KeyboardAwareScrollView>

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={handleDateCancel}
          date={date}
          maximumDate={new Date()}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: ms(16),
    paddingTop: ms(64),
    gap: ms(8),
    backgroundColor: colors.textWhite,
  } as ViewStyle,
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(spacing.xs),
  },
  arrowImage: {
    width: ms(24),
    height: ms(24),
    resizeMode: 'contain',
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  headerSpacer: {
    display: 'none',
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingTop: ms(spacing.lg),
    paddingHorizontal: ms(spacing.lg),
    paddingBottom: ms(spacing.xl * 2),
  } as ViewStyle,
  dateInputWrapper: {
    marginBottom: ms(spacing.md),
  } as ViewStyle,
  dateInputContainer: {
    marginBottom: ms(spacing.md),
  } as ViewStyle,
  dateInputLabel: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
  } as TextStyle,
  dateInputField: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: ms(spacing.sm),
    paddingHorizontal: ms(spacing.md),
    paddingVertical: ms(spacing.sm),
    justifyContent: 'center',
  } as ViewStyle,
  dateInputText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  } as TextStyle,
  thoughtsContainer: {
    marginBottom: ms(spacing.lg),
  } as ViewStyle,
  thoughtsLabel: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: ms(spacing.sm),
  } as TextStyle,
  thoughtsInputWrapper: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: ms(10),
    paddingHorizontal: ms(spacing.sm),
    paddingVertical: ms(spacing.sm),
    backgroundColor: colors.backgroundMain,
  } as ViewStyle,
  thoughtsInput: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    minHeight: ms(150),
  } as TextStyle,
  buttonContainer: {
    gap: ms(spacing.md),
    marginBottom: ms(spacing.xl),
  } as ViewStyle,
});

export default JournalEntryModal;
