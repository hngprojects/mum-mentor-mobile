import { colors, typography } from "@/src/core/styles";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Modal, Text, View } from "react-native";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import { useJournal } from "./journalContext";

interface DeleteModalProps {
  entryId: number | null;
  onCancel: () => void;
  onConfirm: () => void;
  visible: boolean;
}

const DeleteModal = ({
  entryId,
  onCancel,
  onConfirm,
  visible,
}: DeleteModalProps) => {
  const { deleteEntry, isSaving } = useJournal();

  const handleDelete = async () => {
    if (entryId === null) return;

    try {
      await deleteEntry(entryId);
      onConfirm();
    } catch (error) {
      console.error("Failed to delete entry:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            width: "95%",
            flexDirection: "column",
            gap: 24,
            paddingVertical: 24,
            paddingHorizontal: 18,
            borderRadius: 8,
            maxHeight: 325,
            height: "auto",
            backgroundColor: colors.textWhite,
            maxWidth: 378,
            ...typography.bodySmall,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#FBEAED",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="trash-outline" size={24} color="#B2243B" />
          </View>

          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              Delete Entry
            </Text>
            <Text style={{ color: "#6B7280", lineHeight: 20 }}>
              Are you sure you want to delete this entry? This will permanently
              delete your entry.
            </Text>
          </View>

          <View style={{ flexDirection: "column", gap: 8 }}>
            <PrimaryButton
              title={isSaving ? "" : "Delete"}
              onPress={handleDelete}
              disabled={isSaving}
              style={{ backgroundColor: "#B2243B" }}
            >
              {isSaving && <ActivityIndicator color="#FFFFFF" size="small" />}
            </PrimaryButton>
            <SecondaryButton
              title="Cancel"
              onPress={onCancel}
              disabled={isSaving}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
