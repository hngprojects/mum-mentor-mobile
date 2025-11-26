import { colors, spacing, typography } from "@/src/core/styles";
import { ms, rbr, rfs, vs } from "@/src/core/styles/scaling";
import { showToast } from "@/src/core/utils/toast";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Added
import { useSetup } from "../../core/hooks/setupContext";
import { MomSetupData } from "../../core/services/setupStorageService";
import AddGoalModal from "../components/AddGoalModal";
import PrimaryButton from "../components/PrimaryButton";

const momStatuses: string[] = ["Pregnant", "New Mom", "Toddler Mom", "Mixed"];

const defaultGoals: string[] = [
  "Sleep",
  "Feeding",
  "Body Recovery",
  "Emotional Tracker",
  "Mental Wellness",
  "Routine Builder",
];

interface Errors {
  partnersName?: string;
  email?: string;
  momStatus?: string;
  goals?: string;
}

const MomSetupScreen: React.FC = () => {
  const { saveMomSetup } = useSetup();

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [editingGoal, setEditingGoal] = useState<string>("");
  const [editedGoalValue, setEditedGoalValue] = useState<string>("");
  const [goals, setGoals] = useState<string[]>(defaultGoals);
  const [customGoals, setCustomGoals] = useState<string[]>([]);

  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [partnersName, setPartnersName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const [isLoading, setIsLoading] = useState(false);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;

    setGoals([...goals, newGoal]);
    setCustomGoals([...customGoals, newGoal]);
    setSelectedGoals([...selectedGoals, newGoal]);
    setNewGoal("");
    setIsModalVisible(false);
  };

  const handleDeleteGoal = (goal: string) => {
    if (customGoals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
      setCustomGoals(customGoals.filter((g) => g !== goal));
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    }
  };

  const handleOpenEditModal = (goal: string) => {
    setEditingGoal(goal);
    setEditedGoalValue(goal);
    setIsEditModalVisible(true);
  };

  const handleUpdateGoal = () => {
    if (!editedGoalValue.trim() || editedGoalValue === editingGoal) {
      setIsEditModalVisible(false);
      return;
    }

    const updatedGoals = goals.map((g) =>
      g === editingGoal ? editedGoalValue : g
    );
    const updatedCustomGoals = customGoals.map((g) =>
      g === editingGoal ? editedGoalValue : g
    );
    const updatedSelectedGoals = selectedGoals.map((g) =>
      g === editingGoal ? editedGoalValue : g
    );

    setGoals(updatedGoals);
    setCustomGoals(updatedCustomGoals);
    setSelectedGoals(updatedSelectedGoals);

    setIsEditModalVisible(false);
    setEditingGoal("");
    setEditedGoalValue("");
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    let isValid = true;

    if (!selectedStatus) {
      newErrors.momStatus = "Please select a mom status";
      isValid = false;
    }

    if (selectedGoals.length === 0) {
      newErrors.goals = "Please select at least one goal";
      isValid = false;
    }

    if (showInputs) {
      if (!partnersName.trim()) {
        newErrors.partnersName = "Partner's name is required";
        isValid = false;
      }

      if (!email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!email.includes("@")) {
        newErrors.email = "Please enter a valid email";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      showToast.error(
        "Validation Error",
        "Please complete all required fields."
      );
      return;
    }

    setIsLoading(true);

    try {
      const momSetupData: MomSetupData = {
        momStatus: selectedStatus,
        selectedGoals: selectedGoals,
        customGoals: customGoals,
        notificationsEnabled: notificationsEnabled,
      };

      if (showInputs && partnersName.trim() && email.trim()) {
        momSetupData.partner = {
          name: partnersName.trim(),
          email: email.trim().toLowerCase(),
        };
      }

      await saveMomSetup(momSetupData);

      // --- AsyncStorage flag added ---
      await AsyncStorage.setItem("isSetupComplete", "false");

      router.push("/setup/childSetupScreen");
    } catch (error) {
      showToast.error("Error", "Failed to save your setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormBasicValid = () => {
    return selectedStatus.trim().length > 0 && selectedGoals.length > 0;
  };

  return (
    <>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.header}>Set Up</Text>

          {/* Mom Setup Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mom Set up</Text>

            <Text style={styles.label}>Mom Status</Text>
            {errors.momStatus && (
              <Text style={styles.errorText}>{errors.momStatus}</Text>
            )}

            <View style={styles.chipContainer}>
              {momStatuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.chip,
                    selectedStatus === status && styles.chipSelected,
                  ]}
                  onPress={() => {
                    setSelectedStatus(status);
                    setErrors({ ...errors, momStatus: undefined });
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedStatus === status && styles.chipTextSelected,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Goals */}
            <Text style={styles.label}>Goals</Text>
            {errors.goals && (
              <Text style={styles.errorText}>{errors.goals}</Text>
            )}

            <View style={styles.chipContainer}>
              {goals.map((goal) => {
                const isCustomGoal = customGoals.includes(goal);
                return (
                  <View key={goal} style={styles.chipWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.chip,
                        selectedGoals.includes(goal) && styles.chipSelected,
                        isCustomGoal && styles.chipWithButtons,
                      ]}
                      onPress={() => {
                        toggleGoal(goal);
                        setErrors({ ...errors, goals: undefined });
                      }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedGoals.includes(goal) &&
                            styles.chipTextSelected,
                        ]}
                      >
                        {goal}
                      </Text>
                    </TouchableOpacity>

                    {isCustomGoal && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteGoal(goal)}
                        >
                          <Text style={styles.deleteButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}

              <TouchableOpacity
                style={styles.addChip}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.addChipText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            <AddGoalModal
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              newGoal={newGoal}
              setNewGoal={setNewGoal}
              onAddGoal={handleAddGoal}
            />

            {/* <EditGoalModal
              visible={isEditModalVisible}
              onClose={() => {
                setIsEditModalVisible(false);
                setEditingGoal("");
                setEditedGoalValue("");
              }}
              goalValue={editedGoalValue}
              setGoalValue={setEditedGoalValue}
              onUpdateGoal={handleUpdateGoal}
            /> */}
          </View>

          {/* Optional Setup */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optional Set up</Text>

            <View style={styles.notificationRow}>
              <Text style={styles.label}>Prioritise Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.textGrey2, true: colors.primary }}
                thumbColor={
                  notificationsEnabled
                    ? colors.secondaryExtraLight
                    : colors.secondaryExtraLight
                }
              />
            </View>
          </View>

          <PrimaryButton
            title="Next"
            onPress={handleNext}
            isLoading={isLoading}
            disabled={isLoading || !isFormBasicValid()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default MomSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(60),
    paddingBottom: vs(spacing.xl * 2),
  },
  header: {
    ...typography.heading1,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: vs(spacing.xl),
  },
  section: { marginBottom: vs(spacing.xl) },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: vs(spacing.md),
  },
  label: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: vs(spacing.sm),
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginBottom: vs(spacing.xs),
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ms(spacing.sm),
    marginBottom: vs(spacing.md),
  },
  chipWrapper: { position: "relative" },
  chip: {
    paddingVertical: vs(spacing.sm),
    paddingHorizontal: ms(spacing.md),
    borderRadius: rbr(10),
    borderWidth: 1.2,
    borderColor: colors.outline,
  },
  chipWithButtons: { paddingRight: ms(64) },
  chipSelected: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.backgroundStrong,
  },
  chipText: {
    ...typography.labelMedium,
    color: colors.textGrey1,
  },
  chipTextSelected: {
    color: colors.textPrimary,
    fontWeight: "500",
  },
  actionButtons: {
    position: "absolute",
    right: ms(4),
    top: vs(6),
  },
  editButton: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    color: colors.textWhite,
    fontSize: rfs(14),
    fontWeight: "bold",
  },
  deleteButton: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(12),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: colors.textWhite,
    fontSize: rfs(14),
    lineHeight: rfs(20),
  },
  addChip: {
    paddingVertical: vs(spacing.sm),
    paddingHorizontal: ms(spacing.md),
    borderRadius: rbr(10),
    borderWidth: 1.2,
    borderColor: colors.outline,
  },
  addChipText: {
    ...typography.labelMedium,
    color: colors.textGrey1,
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: vs(spacing.sm),
  },
});
