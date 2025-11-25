import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<Props> = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Ionicons name="lock-closed-outline" size={32} color="#333" />
          <Text style={styles.title}>Log Out</Text>
          <Text style={styles.message}>Are you sure you want to log out?</Text>

          <TouchableOpacity style={styles.logoutBtn} onPress={onConfirm}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: "700" },
  message: { fontSize: 14, color: "#555", textAlign: "center" },
  logoutBtn: {
    backgroundColor: "#D83447",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    marginTop: 8,
  },
  logoutText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: "#D83447",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
  },
  cancelText: {
    textAlign: "center",
    color: "#D83447",
    fontSize: 15,
    fontWeight: "600",
  },
});
