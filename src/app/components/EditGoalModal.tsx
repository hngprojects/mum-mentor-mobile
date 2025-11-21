// src/components/EditGoalModal.tsx

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, typography } from '@/src/core/styles';
import { rbr, ms, vs } from '@/src/core/styles/scaling';

interface EditGoalModalProps {
  visible: boolean;
  onClose: () => void;
  goalValue: string;
  setGoalValue: (value: string) => void;
  onUpdateGoal: () => void;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({
  visible,
  onClose,
  goalValue,
  setGoalValue,
  onUpdateGoal,
}) => {

  const slideAnim = useRef(new Animated.Value(400)).current; // bottom start position

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Background pressable so modal closes when tapping outside */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Modal bottom sheet */}
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>

            <Text style={styles.title}>Edit Goal</Text>

            <View style={styles.inputWrapper}>
              <Image
                source={require('../../assets/images/flag.png')}
                style={styles.flagIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter goal name"
                value={goalValue}
                onChangeText={setGoalValue}
                placeholderTextColor={colors.textGrey2}
                autoFocus
              />
            </View>

            <TouchableOpacity style={styles.updateBtn} onPress={onUpdateGoal}>
              <Text style={styles.updateBtnText}>Update Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>

          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditGoalModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: colors.backgroundMain,
    padding: 20,
    borderTopLeftRadius: rbr(20),
    borderTopRightRadius: rbr(20),
  },

  title: {
    ...typography.heading3,
    marginBottom: 20,
    color: colors.textPrimary,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: rbr(10),
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },

  flagIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  input: {
    flex: 1,
    ...typography.labelLarge,
    color: colors.textPrimary,
    paddingVertical: 12,
  },

  updateBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: rbr(10),
    marginBottom: 12,
  },

  updateBtnText: {
    textAlign: 'center',
    color: colors.textWhite,
    ...typography.labelLarge,
  },

  closeBtn: {
    paddingVertical: 12,
    borderRadius: rbr(10),
    borderWidth: 1.2,
    borderColor: colors.primary,
  },

  closeBtnText: {
    ...typography.labelLarge,
    textAlign: 'center',
    color: colors.primary,
  },
});