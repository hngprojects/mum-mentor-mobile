// src/components/ChildSetupItem.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { ms, rh, rw } from '@/src/core/styles/scaling';
import { colors, spacing, typography } from '@/src/core/styles';
import CustomInput from './CustomInput';
import DatePickerInput from './DatePickerInput';
import GenderDropdown from './GenderDropdown';

interface ChildSetupItemProps {
  index: number;
  childData: ChildData;
  onUpdate: (index: number, updated: ChildData) => void;
  onDelete: () => void;
}

export interface ChildData {
  fullName: string;
  age: string;
  dob: string;
  gender: string;
}

const ChildSetupItem: React.FC<ChildSetupItemProps> = ({
  index,
  childData,
  onUpdate,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (key: keyof ChildData, value: string) => {
    onUpdate(index, { ...childData, [key]: value });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.headerText}>Child {index + 1} Set up</Text>

        <Image
          source={
            expanded
              ? require('@/src/assets/images/arrow-up.png')
              : require('@/src/assets/images/arrow-down.png')
          }
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {/* EXPANDED CONTENT */}
      {expanded && (
        <>
          <View style={styles.divider} />
          <View style={styles.form}>
            {/* Child Full Name */}
            <CustomInput
              label="Child's Full Name"
              placeholder="Enter Full Name"
              value={childData.fullName}
              onChangeText={(t) => handleChange('fullName', t)}
              iconName="person-outline"
            />

            {/* Child Age or Due Date */}
            <CustomInput
              label="Child's Age"
              placeholder="Enter Age"
              value={childData.age}
              onChangeText={(t) => handleChange('age', t)}
              iconName="calendar-outline"
            />

            {/* Date of Birth - Now with Calendar Picker */}
            <DatePickerInput
              label="Child's Date Of Birth"
              placeholder="Select Date"
              value={childData.dob}
              onDateChange={(date) => handleChange('dob', date)}
            />

            {/* Gender - Now with Dropdown */}
            <GenderDropdown
              label="Child's Gender"
              value={childData.gender}
              onValueChange={(gender) => handleChange('gender', gender)}
            />
            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
              <Text style={styles.deleteText}>Remove Child</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ChildSetupItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    backgroundColor: colors.backgroundMain,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.backgroundSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ms(spacing.sm),
  },
  headerText: {
    ...typography.labelLarge,
  },
  arrowIcon: {
    width: rw(6),
    height: rh(6),
    resizeMode: 'contain',
  },
  divider: {
    height: rh(0.1),
    backgroundColor: colors.backgroundSubtle,
    marginHorizontal: ms(spacing.sm),
  },
  form: {
    padding: ms(spacing.md),
  },
  deleteBtn: {
    marginTop: ms(12),
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    ...typography.labelMedium,
    color: colors.primary,
  },
});