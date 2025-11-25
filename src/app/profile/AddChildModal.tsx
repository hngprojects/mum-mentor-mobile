// components/AddChildModal.tsx
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AddChildModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddChildModal({ visible, onClose }: AddChildModalProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [birthOrder, setBirthOrder] = useState("");

  const handleSave = () => {
    console.log("Adding new child...", {
      name,
      gender,
      dateOfBirth,
      age,
      birthOrder,
    });
    onClose();
    // Reset form
    setName("");
    setGender("");
    setDateOfBirth("");
    setAge("");
    setBirthOrder("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Child&apos;s Info</Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=1" }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Feather name="camera" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Child's Full Name Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Child&apos;s Full Name</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="user"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.placeholderStyle]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Full Name"
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>

            {/* Gender Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="users"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.placeholderStyle]}
                  value={gender}
                  onChangeText={setGender}
                  placeholder="Enter Gender"
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>

            {/* Date Of Birth Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Date Of Birth</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="calendar"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.placeholderStyle]}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="DD/MM/YY"
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>

            {/* Age Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Age</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="clock"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.placeholderStyle]}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Enter Age"
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>

            {/* Birth Order Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Birth Order</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="list"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.placeholderStyle]}
                  value={birthOrder}
                  onChangeText={setBirthOrder}
                  placeholder="Enter Birth Order"
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#666",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#000",
  },
  placeholderStyle: {
    color: "#CCC",
  },
  saveButton: {
    backgroundColor: "#E63946",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: "#E63946",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  cancelButtonText: {
    color: "#E63946",
    fontSize: 16,
    fontWeight: "700",
  },
});
