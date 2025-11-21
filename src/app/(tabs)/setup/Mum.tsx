import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet
} from 'react-native';
import { colors, spacing, typography } from '@/core/styles';
import { ms, rbr, rfs, vs } from '@/core/styles/scaling';
import AddGoalModal from '../../components/AddGoalModal';
import EditGoalModal from '../../components/EditGoalModal';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { router } from 'expo-router';

interface MumGoal {
  id: number;
  goal: string;
  schedules: string[];
}

const MumSetupScreen = () => {
  const [goals, setGoals] = useState<MumGoal[]>([
    {
      id: 1,
      goal: 'Build consistent sleep routine',
      schedules: ['Daily at 8:00 PM'],
    },
    {
      id: 2,
      goal: 'Track breastfeeding & bottles',
      schedules: ['After each feed'],
    },
  ]);

  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isAddGoalModalVisible, setIsAddGoalModalVisible] = useState(false);
  const [isEditGoalModalVisible, setIsEditGoalModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<MumGoal | null>(null);

  const handleToggleNotification = () => {
    setIsNotificationsEnabled((prev) => !prev);
  };

  const handleAddGoal = (newGoal: string, schedule: string) => {
    const newId = goals.length ? goals[goals.length - 1].id + 1 : 1;
    const newGoalEntry: MumGoal = {
      id: newId,
      goal: newGoal,
      schedules: [schedule],
    };
    setGoals((prevGoals) => [...prevGoals, newGoalEntry]);
    setIsAddGoalModalVisible(false);
  };

  const handleEditGoal = (goalId: number, updatedGoal: string, updatedSchedule: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              goal: updatedGoal,
              schedules: [updatedSchedule],
            }
          : goal
      )
    );
    setIsEditGoalModalVisible(false);
    setSelectedGoal(null);
  };

  const handleOpenEditGoalModal = (goal: MumGoal) => {
    setSelectedGoal(goal);
    setIsEditGoalModalVisible(true);
  };

  const handleContinue = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mum setup</Text>
        <Text style={styles.subtitle}>
          Set goals, reminders, and support so Mum Mentor can support you as a mum.
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Set goals & reminders</Text>
        <Text style={styles.sectionCaption}>
          You can set personal goals and reminders so Mum Mentor AI can hold you accountable.
        </Text>

        <TouchableOpacity
          style={styles.addGoalCard}
          activeOpacity={0.9}
          onPress={() => setIsAddGoalModalVisible(true)}
        >
          <Text style={styles.addGoalText}>+ Add a goal</Text>
          <Text style={styles.addGoalSubText}>
            Create goals like “Build a better sleep routine” or “Have more me-time”.
          </Text>
        </TouchableOpacity>

        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={styles.goalItem}
            activeOpacity={0.8}
            onPress={() => handleOpenEditGoalModal(goal)}
          >
            <View style={styles.goalTextContainer}>
              <Text style={styles.goalTitle}>{goal.goal}</Text>
              <View style={styles.schedulePillContainer}>
                {goal.schedules.map((schedule, index) => (
                  <View key={index} style={styles.schedulePill}>
                    <Text style={styles.scheduleText}>{schedule}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>What would you like Mum Mentor to support you with?</Text>
        <Text style={styles.sectionCaption}>
          You can share your current challenges or priorities, and Mum Mentor AI will personalise support.
        </Text>

        <CustomInput
          label="Tell us more"
          placeholder="E.g. I want help with managing anxiety and balancing work and motherhood."
          multiline
          numberOfLines={4}
        />

        <View style={styles.notificationRow}>
          <Text style={styles.notificationLabel}>Enable notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={handleToggleNotification}
            thumbColor={isNotificationsEnabled ? colors.primary : colors.backgroundSubtle}
            trackColor={{
              false: colors.backgroundSubtle,
              true: colors.primaryLight,
            }}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Finish setup" onPress={handleContinue} />
      </View>

      <AddGoalModal
        visible={isAddGoalModalVisible}
        onClose={() => setIsAddGoalModalVisible(false)}
        onSave={handleAddGoal}
      />

      {selectedGoal && (
        <EditGoalModal
          visible={isEditGoalModalVisible}
          onClose={() => {
            setIsEditGoalModalVisible(false);
            setSelectedGoal(null);
          }}
          goal={selectedGoal}
          onSave={handleEditGoal}
        />
      )}
    </View>
  );
};

export default MumSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: vs(16),
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    marginTop: vs(4),
    marginBottom: vs(8),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: vs(16),
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginTop: vs(16),
    marginBottom: vs(4),
  },
  sectionCaption: {
    ...typography.caption,
    color: colors.textGrey1,
  },
  addGoalCard: {
    marginTop: vs(12),
    padding: spacing.md,
    borderRadius: rbr(16),
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.backgroundSoft,
  },
  addGoalText: {
    ...typography.labelLarge,
    color: colors.primary,
    marginBottom: vs(4),
  },
  addGoalSubText: {
    ...typography.caption,
    color: colors.textGrey1,
  },
  goalItem: {
    marginTop: vs(10),
    padding: spacing.md,
    borderRadius: rbr(16),
    backgroundColor: colors.backgroundSoft,
    borderWidth: 1,
    borderColor: colors.backgroundSubtle,
  },
  goalTextContainer: {
    flexDirection: 'column',
  },
  goalTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: vs(8),
  },
  schedulePillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(4),
  },
  schedulePill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(4),
    borderRadius: rbr(999),
    backgroundColor: colors.backgroundMuted,
  },
  scheduleText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.backgroundSubtle,
    marginVertical: vs(16),
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  notificationLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.backgroundSubtle,
    backgroundColor: colors.backgroundMain,
  },
});
