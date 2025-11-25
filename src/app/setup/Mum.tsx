import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '@/src/core/styles';
import { ms, rbr, rfs, vs } from '@/src/core/styles/scaling';
import AddGoalModal from '../components/AddGoalModal';
import EditGoalModal from '../components/EditGoalModal';
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';
import { router } from 'expo-router';

const momStatuses: string[] = ['Pregnant', 'New Mom', 'Toddler Mom', 'Mixed'];

const defaultGoals: string[] = [
  'Sleep',
  'Feeding',
  'Body Recovery',
  'Emotional Tracker',
  'Mental Wellness',
  'Routine Builder',
];

interface Errors {
  partnersName?: string;
  email?: string;
}

const MomSetupScreen: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [editingGoal, setEditingGoal] = useState<string>("");
  const [editedGoalValue, setEditedGoalValue] = useState<string>("");
  const [goals, setGoals] = useState<string[]>(defaultGoals);
  const [customGoals, setCustomGoals] = useState<string[]>([]); // Track custom goals

  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [partnersName, setPartnersName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;

    setGoals([...goals, newGoal]);
    setCustomGoals([...customGoals, newGoal]); // Track as custom goal
    setNewGoal("");
    setIsModalVisible(false);
  };

  const handleDeleteGoal = (goal: string) => {
    // Only allow deletion of custom goals
    if (customGoals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
      setCustomGoals(customGoals.filter(g => g !== goal));
      setSelectedGoals(selectedGoals.filter(g => g !== goal)); // Also remove from selected
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

    // Update in goals array
    const updatedGoals = goals.map(g => g === editingGoal ? editedGoalValue : g);
    setGoals(updatedGoals);

    // Update in custom goals array
    const updatedCustomGoals = customGoals.map(g => g === editingGoal ? editedGoalValue : g);
    setCustomGoals(updatedCustomGoals);

    // Update in selected goals if it was selected
    const updatedSelectedGoals = selectedGoals.map(g => g === editingGoal ? editedGoalValue : g);
    setSelectedGoals(updatedSelectedGoals);

    setIsEditModalVisible(false);
    setEditingGoal("");
    setEditedGoalValue("");
  };

  const isFormValid = () => {
  // Required: Status chosen
  if (!selectedStatus) return false;

  // Required: At least one goal chosen
  if (selectedGoals.length === 0) return false;

  // Optional partner section: Only validate if inputs are visible
  // if (showInputs) {
  //   if (!partnersName.trim()) return false;
  //   if (!email.trim() || !email.includes("@")) return false;
  // }

  return true;
};


  const nextPage = () => {
    router.push('/setup/childSetupScreen')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
          <View style={styles.chipContainer}>
            {momStatuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.chip,
                  selectedStatus === status && styles.chipSelected
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedStatus === status && styles.chipTextSelected
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Goals */}
          <Text style={styles.label}>Goals</Text>
          <View style={styles.chipContainer}>
            {goals.map((goal) => {
              const isCustomGoal = customGoals.includes(goal);
              return (
                <View key={goal} style={styles.chipWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      selectedGoals.includes(goal) && styles.chipSelected,
                      isCustomGoal && styles.chipWithButtons
                    ]}
                    onPress={() => toggleGoal(goal)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedGoals.includes(goal) && styles.chipTextSelected
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Edit and Delete buttons for custom goals */}
                  {isCustomGoal && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleOpenEditModal(goal)}
                      >
                        <Text style={styles.editButtonText}>✎</Text>
                      </TouchableOpacity>
                      
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

            <TouchableOpacity style={styles.addChip} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.addChipText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Add Goal Modal */}
          <AddGoalModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            newGoal={newGoal}
            setNewGoal={setNewGoal}
            onAddGoal={handleAddGoal}
          />

          {/* Edit Goal Modal */}
          <EditGoalModal
            visible={isEditModalVisible}
            onClose={() => {
              setIsEditModalVisible(false);
              setEditingGoal("");
              setEditedGoalValue("");
            }}
            goalValue={editedGoalValue}
            setGoalValue={setEditedGoalValue}
            onUpdateGoal={handleUpdateGoal}
          />
        </View>

        {/* Optional Setup Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optional Set up</Text>

          <Text style={styles.label}>Add Partner</Text>
          {!showInputs ? (
            <TouchableOpacity
              style={styles.addPartnerButton}
              onPress={() => setShowInputs(true)}
            >
              <Text style={styles.addPartnerText}>+ Add Partner</Text>
            </TouchableOpacity>
          ) : (
            <>
              <CustomInput
                label="Add Partner"
                placeholder="Enter Partners Name"
                value={partnersName}
                onChangeText={setPartnersName}
                isError={!!errors.partnersName}
                errorMessage={errors.partnersName}
                iconName="person-outline"
                isValid={partnersName.length > 0 && !errors.partnersName}
              />
              <CustomInput
                label="Email Address"
                placeholder="Enter Partner Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                isError={!!errors.email}
                errorMessage={errors.email}
                iconName="mail-outline"
                isValid={email.includes('@') && email.length > 0 && !errors.email}
              />
            </>
          )}

          <View style={styles.notificationRow}>
            <Text style={styles.label}>Prioritise Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.textGrey2, true: colors.primary }}
              thumbColor={notificationsEnabled ? colors.secondaryExtraLight : colors.secondaryExtraLight}
            />
          </View>
        </View>
        
        <PrimaryButton
          title="Next"
          onPress={nextPage}
          disabled={!isFormValid()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MomSetupScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.backgroundMain 
  },
  scrollView: { 
    flex: 1, 
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: vs(40),
  },
  header: {
    ...typography.heading1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: ms(60),
    marginBottom: vs(12),
  },
  section: { marginBottom: 30 },
  sectionTitle: { 
    ...typography.heading3,
    color: colors.textPrimary, 
    marginBottom: 20 
  },
  label: { 
    ...typography.labelLarge,
    color: colors.textPrimary, 
    marginBottom: 12, 
  },
  chipContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10,
    marginBottom: 12, 
  },
  chipWrapper: {
    position: 'relative',
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: rbr(10),
    borderWidth: 1.2,
    borderColor: colors.outline,
  },
  chipWithButtons: {
    paddingRight: 64, // Make space for both edit and delete buttons
  },
  chipSelected: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.backgroundStrong,
  },
  chipText: { 
    ...typography.labelMedium, 
    color: colors.textGrey1 
  },
  chipTextSelected: { 
    color: colors.textPrimary, 
    fontWeight: '500' 
  },
  actionButtons: {
    position: 'absolute',
    right: 4,
    top: 4,
    flexDirection: 'row',
    gap: 4,
  },
  editButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  addChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: rbr(10),
    borderWidth: 1.2,
    borderColor: colors.outline,
  },
  addChipText: { 
     ...typography.labelMedium, 
    color: colors.textGrey1 
  },
  addPartnerButton: { 
    alignSelf: 'center', 
    marginBottom: 30 
  },
  addPartnerText: { 
    ...typography.labelLarge, 
    color: colors.primaryLight,  
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});