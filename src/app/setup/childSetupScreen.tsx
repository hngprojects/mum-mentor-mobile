import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import ChildSetupItem, { ChildData } from '../components/ChildSetupItem';
import { colors, typography } from '@/src/core/styles';
import { ms, vs } from '@/src/core/styles/scaling';
import PrimaryButton from '../components/PrimaryButton';
import { SuccessModal, useSuccessModal } from '../components/SucessModal';
import SecondaryButton from '../components/SecondaryButton';
import { router } from 'expo-router';

const SetupScreen = () => {
  const [children, setChildren] = useState<ChildData[]>([
    { fullName: '', age: '', dob: '', gender: '' },
  ]);

  const addChild = () => {
    setChildren([...children, { fullName: '', age: '', dob: '', gender: '' }]);
  };

  const updateChild = (index: number, updatedChild: ChildData) => {
    const newChildren = [...children];
    newChildren[index] = updatedChild;
    setChildren(newChildren);
  };

  const removeChild = (index: number) => {
    const updated = children.filter((_, i) => i !== index);
    setChildren(updated);
  };

  const canceled = () => {
    router.back()
  };

  const { visible, show, hide } = useSuccessModal();

  const isFormComplete = () => {
    return children.every(child =>
      child.fullName?.trim() &&
      child.age?.trim() &&
      child.dob?.trim() &&
      child.gender?.trim()
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Set Up</Text>

        {children.map((child, index) => (
          <ChildSetupItem
            key={index}
            index={index}
            childData={child}
            onUpdate={updateChild}
            onDelete={() => removeChild(index)}
          />
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addChild}>
          <Text style={styles.addBtnText}>＋ Add Another Child</Text>
        </TouchableOpacity>
      </ScrollView>
      <SuccessModal
        visible={visible}
        onClose={hide}
        title="Setup Successful!"
        message=""
        iconComponent={
          <Image
            source={require('../../assets/images/success-icon.png')}   
            style={styles.successIcon}        
          />
        }
      />

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <PrimaryButton
          title="Done"
          onPress={show}
          disabled={!isFormComplete()}
        />

        <SecondaryButton
          title="Cancel"
          onPress={canceled} 
        />
      </View>
    </View>
  );
};

export default SetupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundMain,
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  title: {
    ...typography.heading1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: ms(60),
    marginBottom: vs(12),
  },
  addBtn: {
    alignSelf: 'center',
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
  successIcon:{
    width: ms(60),
    height: ms(60)
  }
});
