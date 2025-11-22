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
  TouchableWithoutFeedback
} from 'react-native';
import { colors, typography } from '../../core/styles/index';
import { rbr, ms, vs } from '../../core/styles/scaling';

interface EditGoalModalProps {
  visible: boolean;
  onClose: () => void;
  goal: {
    id: number;
    goal: string;
    schedules: string[];
  };
  onSave: (goalId: number, updatedGoal: string, updatedSchedule: string) => void;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ visible, onClose, goal, onSave }) => {
  const [goalText, setGoalText] = React.useState(goal.goal);
  const [schedule, setSchedule] = React.useState(goal.schedules[0] || '');

  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setGoalText(goal.goal);
      setSchedule(goal.schedules[0] || '');
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, goal, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const handleSave = () => {
    if (!goalText.trim() || !schedule.trim()) {
      return;
    }
    onSave(goal.id, goalText.trim(), schedule.trim());
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheetContainer, { transform: [{ translateY }] }]}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Image
                source={require('@/assets/icons/icon_edit.png')}
                style={{ width: 24, height: 24 }}
              />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>Edit goal</Text>
              <Text style={styles.subtitle}>
                Update your goal or schedule as your needs change.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Build a consistent sleep routine"
              placeholderTextColor={colors.textGrey2}
              value={goalText}
              onChangeText={setGoalText}
            />

            <Text style={[styles.label, { marginTop: 16 }]}>Schedule</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g. Daily at 8:00 PM"
              placeholderTextColor={colors.textGrey2}
              value={schedule}
              onChangeText={setSchedule}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleSave} activeOpacity={0.9} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save changes</Text>
            </TouchableOpacity>

            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default EditGoalModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 5, 0.65)',
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 0,
    paddingBottom: vs(20),
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.backgroundMain,
    borderTopLeftRadius: rbr(28),
    borderTopRightRadius: rbr(28),
    paddingHorizontal: ms(20),
    paddingTop: vs(16),
    paddingBottom: vs(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ms(12),
    marginBottom: vs(12),
  },
  iconWrap: {
    width: ms(44),
    height: ms(44),
    borderRadius: rbr(22),
    backgroundColor: colors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    ...typography.heading3,
    marginBottom: 4,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textGrey1,
  },
  form: {
    marginTop: vs(8),
  },
  label: {
    ...typography.labelSmall,
    marginBottom: 4,
    color: colors.textGrey1,
  },
  input: {
    borderRadius: rbr(12),
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: ms(12),
    paddingVertical: vs(10),
    ...typography.bodySmall,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSoft,
  },
  actions: {
    marginTop: vs(20),
    gap: vs(8),
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: rbr(999),
    paddingVertical: vs(12),
    alignItems: 'center',
  },
  saveBtnText: {
    ...typography.buttonText,
    color: colors.textWhite,
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
