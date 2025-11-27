import { colors, typography } from '@/src/core/styles';
import React from 'react';
import { Image, Modal, Text, View } from 'react-native';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

interface DeleteModalProps {
    onCancel: () => void,
    onConfirm: () => void,
    visible: boolean
}

const DeleteModal = ({onCancel, onConfirm, visible}: DeleteModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}  // THIS enables the dark background
       animationType="fade"
    >
        <View style={{flex: 1,backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center',  alignItems: 'center', paddingHorizontal: 24}}>
            <View style={{ width: "95%", flexDirection: "column", gap: 24, paddingVertical: 24, paddingHorizontal: 18, borderRadius: 8, maxHeight: 325, height: "auto",
                backgroundColor: colors.textWhite, maxWidth: 378,  ...typography.bodySmall}}>
                <Image source={require('../../assets/images/journal/trash2.svg')}/>
                <View>
                    <Text>Delete Task</Text>
                    <Text>Are you sure you want to delete this entry?This will permanently delete your entry.</Text>
                </View>
                <View style={{flexDirection: "column", gap: 8}}>
                    <PrimaryButton title='Delete' onPress={onConfirm}/>
                    <SecondaryButton title='Cancel' onPress={onCancel}/>
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default DeleteModal