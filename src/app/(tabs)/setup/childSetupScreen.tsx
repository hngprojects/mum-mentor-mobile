import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import ChildSetupItem, { ChildData } from '../../components/ChildSetupItem';
import { colors, typography } from '@/core/styles';
import { ms, vs } from '@/core/styles/scaling';
import PrimaryButton from '../../components/PrimaryButton';
import { SuccessModal, useSuccessModal } from '../../components/SucessModal';
import SecondaryButton from '../../components/SecondaryButton';

const SetupScreen = () => {
  const [children, setChildren] = useState<ChildData[]>([
    { fullName: '', age: '', dob: '', gender: '' },
  ]);

  const addChild = () => {
    setChildren([...children, { fullName: '', age: '', dob: '', gender: '' }]);
  };

  const updateChild = (index: number, updatedChild: ChildData) => {
    const updatedChildren = [...children];
    updatedChildren[index] = updatedChild;
    setChildren(updatedChildren);
  };

  const removeChild = (index: number) => {
    const updatedChildren = children.filter((_, i) => i !== index);
    setChildren(updatedChildren);
  };

  const { hide, show, visible } = useSuccessModal();

  const onSave = () => {
    console.log('Saved children data:', children);
    show();
  };

  const canSave = children.length > 0 && children.every(
    (child) => child.fullName.trim() && child.age.trim() && child.dob.trim() && child.gender.trim()
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.setupHeader}>
        <Text style={styles.setupTitle}>Child setup</Text>
        <Text style={styles.setupSubtitle}>
          Setup your child’s profile so mum mentor can know how to help.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children.map((child, index) => (
          <ChildSetupItem
            key={index}
            index={index}
            childData={child}
            onUpdate={updateChild}
            onRemove={removeChild}
          />
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addChild}>
          <Image
            source={require('@/assets/icons/icon_add.png')}
            style={{ width: 18, height: 20, marginRight: 10 }}
          />
          <Text style={styles.addBtnText}>Add another child</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomButtons}>
        <PrimaryButton
          title="Save and continue"
          onPress={onSave}
          disabled={!canSave}
        />
        <SecondaryButton title="Skip for now" onPress={() => {}} />
      </View>

      <SuccessModal
        visible={visible}
        title="Profile setup completed"
        message="Your child's profile has been set up. You can now start using Mum Mentor."
        actionLabel="Continue"
        onAction={() => {
          hide();
        }}
        onClose={hide}
      />
    </View>
  );
};

export default SetupScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  setupHeader: {
    paddingHorizontal: ms(20),
    paddingTop: vs(16),
  },
  setupTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  setupSubtitle: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    marginTop: vs(4),
    marginBottom: vs(8),
  },
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingBottom: vs(12),
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    marginVertical: 20,
  },
  addBtnText: {
    ...typography.labelLarge,
    color: colors.primary,
  },
  bottomButtons: {
    padding: 20,
    gap: 12,
    backgroundColor: colors.backgroundMain,
    borderColor: colors.backgroundSubtle,
  },
});
