import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { ms, rh, rw } from '@/core/styles/scaling';
import { colors, spacing, typography } from '@/core/styles';
import CustomInput from './CustomInput';

interface ChildSetupItemProps {
  index: number;
  childData: ChildData;
  onUpdate: (index: number, updated: ChildData) => void;
  onRemove: (index: number) => void;
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
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleChange = (field: keyof ChildData, value: string) => {
    const updated = { ...childData, [field]: value };
    onUpdate(index, updated);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  const childLabel = `Child ${index + 1}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={handleToggleExpand}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{childLabel}</Text>
          {index > 0 && (
            <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.subHeader}>
          <Text style={styles.summaryText}>
            {childData.fullName || 'Tap to set up child details'}
          </Text>
          <Image
            source={
              isExpanded
                ? require('@/assets/icons/icon_chevron_up.png')
                : require('@/assets/icons/icon_chevron_down.png')
            }
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.form}>
          <CustomInput
            label="Full name"
            placeholder="Enter child's full name"
            value={childData.fullName}
            onChangeText={(value) => handleChange('fullName', value)}
          />
          <CustomInput
            label="Age"
            placeholder="E.g. 3 years"
            value={childData.age}
            onChangeText={(value) => handleChange('age', value)}
          />
          <CustomInput
            label="Date of birth"
            placeholder="DD/MM/YYYY"
            value={childData.dob}
            onChangeText={(value) => handleChange('dob', value)}
          />
          <CustomInput
            label="Gender"
            placeholder="E.g. Male/Female"
            value={childData.gender}
            onChangeText={(value) => handleChange('gender', value)}
          />
        </View>
      )}

      <View style={styles.divider} />
    </View>
  );
};

export default ChildSetupItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: colors.backgroundSubtle,
    backgroundColor: colors.backgroundSoft,
    marginBottom: ms(12),
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: ms(spacing.md),
    paddingVertical: ms(spacing.sm),
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  removeBtn: {
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
  },
  removeText: {
    ...typography.caption,
    color: colors.error,
  },
  subHeader: {
    marginTop: ms(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    ...typography.caption,
    color: colors.textGrey1,
    flex: 1,
    marginRight: ms(8),
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
});
