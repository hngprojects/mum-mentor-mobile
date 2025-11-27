// components/EditChildModal.tsx
import { Feather } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

// API Imports
import {
  updateChildProfile,
  uploadChildProfilePicture,
  formatDateForApi,
  parseDateFromApi,
} from "../../core/services/childProfile.service";
import { ChildProfile, UpdateChildProfileRequest } from "../../types/child.types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface EditChildModalProps {
  visible: boolean;
  onClose: () => void;
  child: ChildProfile | null;
}

export function EditChildModal({
  visible,
  onClose,
  child,
}: EditChildModalProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthOrder, setBirthOrder] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Update form when child prop changes
  useEffect(() => {
    if (child) {
      setName(child.full_name);
      setGender(child.gender);
      setDateOfBirth(parseDateFromApi(child.date_of_birth));
      setBirthOrder(child.birth_order.toString());
      setProfilePicture(child.profile_picture_url || null);
    }
  }, [child]);

  /**
   * Request camera/gallery permissions
   */
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload photos."
        );
        return false;
      }
    }
    return true;
  };

  /**
   * Handle image picker
   */
  const handlePickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfilePicture(imageUri);

        // If we have a child ID, upload immediately
        if (child?.id) {
          await handleUploadImage(imageUri);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  /**
   * Handle image upload
   */
  const handleUploadImage = async (imageUri: string) => {
    if (!child?.id) return;

    try {
      setUploadingImage(true);
      
      const imageFile = {
        uri: imageUri,
        name: `profile_${Date.now()}.jpg`,
        type: "image/jpeg",
      };

      const response = await uploadChildProfilePicture(child.id, imageFile);
      setProfilePicture(response.profile_picture_url);
      Alert.alert("Success", "Profile picture uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload profile picture");
    } finally {
      setUploadingImage(false);
    }
  };

  /**
   * Handle date change
   */
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  /**
   * Format date for display
   */
  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter child's name");
      return false;
    }
    if (!gender.trim()) {
      Alert.alert("Validation Error", "Please enter gender");
      return false;
    }
    if (!birthOrder.trim() || isNaN(parseInt(birthOrder))) {
      Alert.alert("Validation Error", "Please enter a valid birth order");
      return false;
    }
    return true;
  };

  /**
   * Handle save
   */
  const handleSave = async () => {
    if (!child?.id) return;
    if (!validateForm()) return;

    try {
      setLoading(true);

      const updateData: UpdateChildProfileRequest = {
        full_name: name.trim(),
        gender: gender.trim(),
        date_of_birth: formatDateForApi(dateOfBirth),
        birth_order: parseInt(birthOrder),
      };

      await updateChildProfile(child.id, updateData);
      Alert.alert("Success", "Child profile updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating child:", error);
      Alert.alert("Error", "Failed to update child profile. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.headerTitle}>Edit Child&apos;s Info</Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <Image
                source={{
                  uri: profilePicture || "https://i.pravatar.cc/150?img=1",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handlePickImage}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Feather name="camera" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            </View>

            {/* Name Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Name/Nickname</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="user"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter name"
                  editable={!loading}
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
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={gender}
                  onChangeText={setGender}
                  placeholder="Enter gender"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Date of Birth Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <Feather
                  name="calendar"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <Text style={styles.dateText}>
                  {formatDateForDisplay(dateOfBirth)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            {/* Birth Order Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Birth Order</Text>
              <View style={styles.inputContainer}>
                <Feather
                  name="list"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={birthOrder}
                  onChangeText={setBirthOrder}
                  placeholder="Enter birth order (e.g., 1, 2, 3)"
                  keyboardType="number-pad"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
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
    minHeight: 56,
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
  dateText: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#000",
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
  buttonDisabled: {
    opacity: 0.6,
  },
});