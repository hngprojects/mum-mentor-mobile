"use client";

import * as ImagePicker from "expo-image-picker";
import type React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import { useJournal } from "./journalContext";

interface EditFormProps {
  isEditing: boolean;
  visible: boolean;
  onClose?: () => void;
  existingEntry?: {
    id?: number;
    title: string;
    date: string;
    category: string;
    mood: string;
    imageUrl: any;
    thoughts: string;
  };
}

export const categories = [
  { title: "Sleep", color: "#5B3C8A", bgColor: "#e4d4ff" },
  { title: "Memories", color: "#2C9E76", bgColor: "#D7F4EA66" },
  { title: "Challenges", color: "#B2243B", bgColor: "#FBEAED" },
  { title: "Milestones", color: "#5B3C8A", bgColor: "#e4d4ff" },
  { title: "Selfcare", color: "#AB9F45", bgColor: "#FDF7C5B2" },
  { title: "Body Recovery", color: "#3B82F6", bgColor: "#DBEAFE" },
];

export const moods = [
  "Angry 😡",
  "Self 🧘‍♀️",
  "Love ❤️",
  "Happy 😊",
  "Stressed 🙁",
  "Sad 😞",
  "Memories ❤️",
];

const formatDateForStorage = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const EditForm: React.FC<EditFormProps> = ({
  isEditing,
  onClose,
  existingEntry,
  visible,
}) => {
  const { addEntry, updateEntry, isSaving } = useJournal();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(formatDateForStorage(new Date()));
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [addMood, setAddMood] = useState(false);
  const [customMood, setCustomMood] = useState("");

  useEffect(() => {
    if (visible) {
      if (existingEntry && isEditing) {
        setTitle(existingEntry.title || "");
        setDate(existingEntry.date || formatDateForStorage(new Date()));
        setSelectedCategory(existingEntry.category || "");
        setSelectedMood(existingEntry.mood || "");
        setThoughts(existingEntry.thoughts || "");
        setImageUrl(
          typeof existingEntry.imageUrl === "string"
            ? existingEntry.imageUrl
            : ""
        );
      } else {
        // Reset for new entry
        setTitle("");
        setDate(formatDateForStorage(new Date()));
        setSelectedCategory("");
        setSelectedMood("");
        setThoughts("");
        setImageUrl("");
        setCustomMood("");
        setAddMood(false);
      }
    }
  }, [visible, existingEntry, isEditing]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDate(formatDateForStorage(new Date()));
    setSelectedMood("");
    setSelectedCategory("");
    setThoughts("");
    setImageUrl("");
    onClose?.();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    const finalMood = customMood || selectedMood;

    const entryData = {
      title: title.trim(),
      category: selectedCategory,
      mood: finalMood,
      thoughts: thoughts.trim(),
      date: date,
      imageUrl: imageUrl,
    };

    try {
      if (isEditing && existingEntry?.id) {
        await updateEntry(existingEntry.id, entryData);
      } else {
        await addEntry(entryData);
      }
      onClose?.();
    } catch (error) {
      console.error("Failed to save entry:", error);
      alert("Failed to save entry. Please try again.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ScrollView style={{ paddingBottom: 16, marginHorizontal: "auto" }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? "Edit entry" : "New entry"}
          </Text>
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Entry title...."
            placeholderTextColor="#C7C7CD"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Date Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={styles.dateInput}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />
            <Image
              source={require("../../assets/images/journal/calendar.png")}
              style={{ height: 24, width: 24 }}
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chipContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.title}
                style={[
                  styles.chip,
                  selectedCategory === category.title && styles.chipSelected,
                ]}
                onPress={() => setSelectedCategory(category.title)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategory === category.title &&
                      styles.chipTextSelected,
                  ]}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mood Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Mood (Optional)</Text>
          <View style={styles.chipContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.chip,
                  selectedMood === mood && styles.chipSelected,
                ]}
                onPress={() => {
                  setSelectedMood(mood);
                  setCustomMood("");
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedMood === mood && styles.chipTextSelected,
                  ]}
                >
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddMood(!addMood)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {addMood && (
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Enter your mood with an emoji..."
              placeholderTextColor="#C7C7CD"
              value={customMood}
              onChangeText={(text) => {
                setCustomMood(text);
                setSelectedMood("");
              }}
            />
          )}
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Photos (Optional)</Text>
          <View style={styles.photoInputContainer}>
            <TextInput
              style={styles.photoInput}
              placeholder="Image URL or select..."
              value={imageUrl}
              placeholderTextColor="#C7C7CD"
              onChangeText={setImageUrl}
            />
            <TouchableOpacity style={styles.photoAddButton} onPress={pickImage}>
              <Text style={styles.photoAddIcon}>+</Text>
            </TouchableOpacity>
          </View>
          {/* Image Preview */}
          {imageUrl ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageUrl("")}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Your Thoughts */}
        <View style={styles.section}>
          <Text style={styles.label}>Your Thoughts</Text>
          <TextInput
            style={styles.thoughtsInput}
            placeholder="Write about your day, feelings and moment....."
            placeholderTextColor="#C7C7CD"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={thoughts}
            onChangeText={setThoughts}
          />
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <PrimaryButton
            title={isSaving ? "" : "Save"}
            onPress={handleSave}
            style={{ marginBottom: 16 }}
            disabled={isSaving}
          >
            {isSaving && <ActivityIndicator color="#FFFFFF" size="small" />}
          </PrimaryButton>
          <SecondaryButton
            title="Cancel"
            onPress={handleCancel}
            style={{ backgroundColor: "white" }}
            disabled={isSaving}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: "#000000",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  chipSelected: {
    borderColor: "#FF3B30",
    borderWidth: 2,
  },
  chipText: {
    fontSize: 14,
    color: "#3C3C43",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#000000",
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  addButtonText: {
    fontSize: 14,
    color: "#3C3C43",
    fontWeight: "500",
  },
  photoInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  photoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
  },
  photoAddButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
  photoAddIcon: {
    fontSize: 24,
    color: "#FF3B30",
    fontWeight: "300",
  },
  thoughtsInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
    minHeight: 120,
  },
  imagePreviewContainer: {
    marginTop: 12,
    position: "relative",
    width: 100,
    height: 100,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default EditForm;
