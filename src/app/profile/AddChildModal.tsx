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
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

// API Imports
import {
  createChildProfile,
  uploadChildProfilePicture,
  formatDateForApi,
} from "../../core/services/childProfile.service";
import { CreateChildProfileRequest } from "../../types/child.types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfileSetupId } from "../../core/services/profileSetup.service";

// ============================================================================
// TODO: IMPORT YOUR AUTH CONTEXT OR USER PROFILE HOOK HERE
// ============================================================================
// Option 1: If you have an auth context with user data:
// import { useAuth } from "../../core/context/AuthContext";
//
// Option 2: If you store it in AsyncStorage:
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// Option 3: If you have a user profile API:
// import { useUserProfile } from "../../hooks/useUserProfile";
// ============================================================================

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
  const [loading, setLoading] = useState(false);

  // ============================================================================
  // TODO: GET profile_setup_id FROM YOUR AUTH SYSTEM
  // ============================================================================
  // Option 1: From auth context
  // const { user } = useAuth();
  // const setupId = user?.profile_setup_id;
  //
  // Option 2: From user profile hook
  // const { profile } = useUserProfile();
  // const setupId = profile?.profile_setup_id;
  //
  // Option 3: Load from AsyncStorage (you'll need to make this async)
  // const [setupId, setSetupId] = useState<string | null>(null);
  // useEffect(() => {
  //   AsyncStorage.getItem('profile_setup_id').then(setSetupId);
  // }, []);
  // ============================================================================

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
        setProfilePicture(result.assets[0].uri);
        console.log('📸 Profile picture selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  /**
   * Handle date change
   */
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      console.log('📅 Date of birth selected:', selectedDate.toISOString());
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

  /**
   * Reset form
   */
  const resetForm = () => {
    setName("");
    setGender("");
    setDateOfBirth(new Date());
    setBirthOrder("");
    setProfilePicture(null);
  };

  /**
   * Handle save
   */
  const handleSave = async () => {
    console.log('='.repeat(60));
    console.log('🟢 AddChildModal - handleSave called');
    console.log('='.repeat(60));
    console.log('📝 Form values:', {
      name,
      gender,
      dateOfBirth: dateOfBirth.toISOString(),
      formattedDate: formatDateForDisplay(dateOfBirth),
      birthOrder,
      profilePicture: profilePicture ? 'Selected' : 'None',
    });
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    // Get profile_setup_id using the service
    const setupId = profileSetupId || await getProfileSetupId();
    
    if (!setupId) {
      console.error('⚠️ CRITICAL: profile_setup_id is missing!');
      Alert.alert(
        "Profile Setup Required",
        "Could not retrieve your profile setup. Please ensure you have completed the onboarding process and are logged in."
      );
      return;
    }

    console.log('🔑 Using profile_setup_id:', setupId);

    try {
      setLoading(true);

      // Prepare the request data
      const createData: CreateChildProfileRequest = {
        profile_setup_id: setupId,
        full_name: name.trim(),
        gender: gender.trim(),
        date_of_birth: formatDateForApi(dateOfBirth),
        birth_order: parseInt(birthOrder),
      };

      console.log('📤 Sending create request with data:');
      console.log(JSON.stringify(createData, null, 2));

      // Create the child profile
      console.log('🌐 Calling createChildProfile API...');
      const newChild = await createChildProfile(createData);
      console.log('✅ Child profile created successfully!');
      console.log('📦 New child data:', JSON.stringify(newChild, null, 2));

      // Upload profile picture if selected
      if (profilePicture && newChild.id) {
        console.log('📸 Uploading profile picture...');
        try {
          const imageFile = {
            uri: profilePicture,
            name: `profile_${Date.now()}.jpg`,
            type: "image/jpeg",
          };
          console.log('📤 Image file details:', imageFile);
          
          const uploadResult = await uploadChildProfilePicture(newChild.id, imageFile);
          console.log('✅ Profile picture uploaded successfully!');
          console.log('📦 Upload result:', JSON.stringify(uploadResult, null, 2));
        } catch (imageError) {
          console.error("❌ Error uploading image:", imageError);
          // Don't fail the entire operation if image upload fails
          Alert.alert(
            "Partial Success",
            "Child profile created successfully, but profile picture upload failed. You can try uploading it again by editing the profile."
          );
        }
      } else if (!profilePicture) {
        console.log('ℹ️ No profile picture selected, skipping upload');
      } else if (!newChild.id) {
        console.error('⚠️ newChild.id is missing, cannot upload picture');
      }

      console.log('✅ All operations completed successfully!');
      Alert.alert("Success", "Child profile added successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.log('='.repeat(60));
      console.error("❌ ERROR in handleSave");
      console.log('='.repeat(60));
      console.error("Error:", error);
      console.error("Error type:", typeof error);
      console.error("Error stringified:", JSON.stringify(error, null, 2));
      
      // More detailed error message
      let errorMessage = "Failed to add child profile. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please check console for details.";
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    console.log('🔵 AddChildModal - Cancelled');
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
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
                source={{
                  uri: profilePicture || "https://i.pravatar.cc/150?img=1",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handlePickImage}
                disabled={loading}
              >
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
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Full Name"
                  placeholderTextColor="#CCC"
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
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={gender}
                  onChangeText={setGender}
                  placeholder="Enter Gender (e.g., Male, Female)"
                  placeholderTextColor="#CCC"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Date Of Birth Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>Date Of Birth</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <Feather
                  name="calendar"
                  size={20}
                  color="#999"
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
                  color="#999"
                  style={styles.inputIcon}
                />
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

            {/* Helper Text */}
            <View style={styles.helperSection}>
              <Feather name="info" size={16} color="#999" />
              <Text style={styles.helperText}>
                Birth order: 1 for first child, 2 for second child, etc.
              </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={styles.loadingText}>Creating...</Text>
                </View>
              ) : (
                <Text style={styles.saveButtonText}>Add Child</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
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
  helperSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  helperText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
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