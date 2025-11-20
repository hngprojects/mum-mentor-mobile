import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet
} from 'react-native';
import { OTPVerificationScreen } from '../(auth)/OtpScreen';

const momStatuses: string[] = ['Pregnant', 'New Mom', 'Toddler Mom', 'Mixed'];

const goalsList: string[] = [
  'Sleep',
  'Feeding',
  'Body Recovery',
  'Emotional Tracker',
  'Mental Wellness',
  'Routine Builder',
];

const MomSetupScreen: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

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
            {goalsList.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.chip,
                  selectedGoals.includes(goal) && styles.chipSelected
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
            ))}

            <TouchableOpacity style={styles.addChip}>
              <Text style={styles.addChipText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Optional Setup Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optional Set up</Text>

          <Text style={styles.label}>Add Partner</Text>
          <TouchableOpacity style={styles.addPartnerButton}>
            <Text style={styles.addPartnerText}>+ Add Partner</Text>
          </TouchableOpacity>

          <View style={styles.notificationRow}>
            <Text style={styles.label}>Prioritise Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
              thumbColor={notificationsEnabled ? '#F87171' : '#F3F4F6'}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MomSetupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  header: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 12 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  chipSelected: {
    backgroundColor: '#F3F4F6',
    borderColor: '#9CA3AF',
  },
  chipText: { fontSize: 14, color: '#6B7280' },
  chipTextSelected: { color: '#111827', fontWeight: '500' },
  addChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  addChipText: { fontSize: 14, color: '#6B7280' },
  addPartnerButton: { alignSelf: 'flex-start', marginBottom: 30 },
  addPartnerText: { fontSize: 14, color: '#EF4444', fontWeight: '500' },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  nextButton: {
    backgroundColor: '#F87171',
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
