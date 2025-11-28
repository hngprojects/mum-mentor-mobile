// components/AddChildModal.tsx
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// API Imports
import {
  createChildProfile,
  formatDateForApi,
  uploadChildProfilePicture,
} from "../../core/services/childProfile.service";
import { getProfileSetupId } from "../../core/services/profileSetup.service";
import { CreateChildProfileRequest } from "../../types/child.types";
import GenderDropdown from "../components/GenderDropdown";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AddChildModalProps {
  visible: boolean;
  onClose: () => void;
  profileSetupId?: string; // Optional: Pass this from parent if available
}

export function AddChildModal({
  visible,
  onClose,
  profileSetupId,
}: AddChildModalProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthOrder, setBirthOrder] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | { uri: string; name?: string; type?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Request camera/gallery permissions
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

  // Handle image picker
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
        const asset = result.assets[0];

        if (Platform.OS === "web") {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const file = new File([blob], `profile_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setProfilePicture(asset.uri); // For display
          setSelectedImage(file);        // For upload
        } else {
          const fileObj = {
            uri: asset.uri,
            name: `profile_${Date.now()}.jpg`,
            type: "image/jpeg",
          };
          setProfilePicture(asset.uri);  // For display
          setSelectedImage(fileObj);     // For upload
        }
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDateOfBirth(selectedDate);
  };

  const formatDateForDisplay = (date: Date): string =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter child's full name");
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

  const resetForm = () => {
    setName("");
    setGender("");
    setDateOfBirth(new Date());
    setBirthOrder("");
    setProfilePicture(null);
    setSelectedImage(null);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const setupId = profileSetupId || (await getProfileSetupId());
    if (!setupId) {
      Alert.alert(
        "Profile Setup Required",
        "Could not retrieve your profile setup. Please ensure you have completed onboarding."
      );
      return;
    }

    try {
      setLoading(true);

      const createData: CreateChildProfileRequest = {
        profile_setup_id: setupId,
        full_name: name.trim(),
        gender: gender.trim(),
        date_of_birth: formatDateForApi(dateOfBirth),
        birth_order: parseInt(birthOrder),
      };

      console.log("📝 Sending child profile data:", createData);

      const newChild = await createChildProfile(createData);
      
      console.log("📦 Server response:", newChild);

      // Check if we got a valid response with an ID
      if (!newChild || !newChild.id) {
        console.error("❌ Invalid server response:", newChild);
        throw new Error("Server did not return a valid child profile. Please try again.");
      }

      console.log("✅ Child profile created with ID:", newChild.id);

      // Only attempt image upload if we have both an image and a valid ID
      if (selectedImage) {
        console.log("🖼 Uploading profile picture for child ID:", newChild.id);
        try {
          await uploadChildProfilePicture(newChild.id, selectedImage);
          console.log("✅ Profile picture uploaded successfully");
        } catch (imageError) {
          console.error("❌ Error uploading image:", imageError);
          // Don't fail the entire operation if just the image upload fails
          Alert.alert(
            "Partial Success",
            "Child profile created successfully, but profile picture upload failed. You can update it later."
          );
        }
      }

      Alert.alert("Success", "Child profile added successfully!");
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("❌ ERROR in handleSave:", error);
      
      // Extract meaningful error message
      const errorMessage = error?.message || 
                          error?.response?.data?.message || 
                          error?.response?.data?.detail ||
                          "Failed to add child profile. Please try again.";
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleCancel}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleCancel} />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Child&apos;s Info</Text>
          </View>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.avatarSection}>
              <Image
                source={{
                  uri: profilePicture || "https://i.pravatar.cc/150?img=1",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage} disabled={loading}>
                <Feather name="camera" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Full Name */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Child&apos;s Full Name</Text>
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Full Name"
                  placeholderTextColor="#CCC"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Gender - FIXED: Removed inputContainer wrapper */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Gender</Text>
              <GenderDropdown 
                label="Child's Gender" 
                value={gender} 
                onValueChange={setGender} 
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Date Of Birth</Text>
              <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)} disabled={loading}>
                <Feather name="calendar" size={20} color="#999" style={styles.inputIcon} />
                <Text style={styles.dateText}>{formatDateForDisplay(dateOfBirth)}</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker value={dateOfBirth} mode="date" display="default" onChange={handleDateChange} maximumDate={new Date()} />
            )}

            {/* Birth Order */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Birth Order</Text>
              <View style={styles.inputContainer}>
                <Feather name="list" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={birthOrder}
                  onChangeText={setBirthOrder}
                  placeholder="Enter Birth Order (e.g., 1, 2, 3)"
                  placeholderTextColor="#CCC"
                  keyboardType="number-pad"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity style={[styles.saveButton, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={styles.loadingText}>Creating...</Text>
                </View>
              ) : (
                <Text style={styles.saveButtonText}>Add Child</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={loading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContainer: { backgroundColor: "#FFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: SCREEN_HEIGHT * 0.9, overflow: "hidden" },
  header: { paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  cameraButton: { position: "absolute", bottom: 0, right: "35%", backgroundColor: "#666", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  formSection: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#000" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5", borderRadius: 8, paddingHorizontal: 16, minHeight: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: "#000" },
  dateText: { flex: 1, paddingVertical: 16, fontSize: 16, color: "#000" },
  saveButton: { backgroundColor: "#E63946", paddingVertical: 16, borderRadius: 8, alignItems: "center", marginTop: 8, marginBottom: 12 },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  loadingContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  loadingText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  cancelButton: { borderWidth: 2, borderColor: "#E63946", paddingVertical: 16, borderRadius: 8, alignItems: "center", marginBottom: 32 },
  cancelButtonText: { color: "#E63946", fontSize: 16, fontWeight: "700" },
  buttonDisabled: { opacity: 0.6 },
});