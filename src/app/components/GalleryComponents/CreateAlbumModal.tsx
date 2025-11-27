// src/components/gallery/CreateAlbumModal.tsx

import { colors, spacing, typography } from "@/src/core/styles";
import { ms, rfs, vs } from "@/src/core/styles/scaling";
import { showToast } from "@/src/core/utils/toast";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomInput from "../CustomInput";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";

interface CreateAlbumModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (albumName: string) => void;
}

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [albumName, setAlbumName] = useState("");

  const handleSave = () => {
    if (!albumName.trim()) {
      showToast.error("Error", "Please enter an album name");
      return;
    }

    onSave(albumName.trim());
    setAlbumName(""); // Reset after save
  };

  const handleCancel = () => {
    setAlbumName(""); // Reset on cancel
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Create Album</Text>
                <Text style={styles.subtitle}>
                  Gather memories that belong together
                </Text>
              </View>

              {/* Album Name Input */}
              <View style={styles.inputContainer}>
                <CustomInput
                  label="Album name"
                  placeholder="e.g Tiny Smiles"
                  value={albumName}
                  onChangeText={setAlbumName}
                  iconName="gallery-outline"
                />
              </View>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <PrimaryButton
                  title="Save"
                  onPress={handleSave}
                  disabled={!albumName.trim()}
                />
                <SecondaryButton title="Cancel" onPress={handleCancel} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateAlbumModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.backgroundMain,
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(spacing.xl),
    paddingBottom: vs(spacing.xl * 2),
  },
  header: {
    alignItems: "center",
    marginBottom: vs(spacing.lg),
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: vs(spacing.xs),
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: "center",
    fontSize: rfs(14),
  },
  inputContainer: {
    marginBottom: vs(spacing.lg),
  },
  buttonsContainer: {
    gap: vs(spacing.sm),
  },
});
