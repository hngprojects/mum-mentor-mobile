// screens/ChildInfoScreen.tsx
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

// --- Component Imports ---
import { AddChildModal } from "./AddChildModal";
import { EditChildModal } from "./EditChildModal";

interface Child {
  id: number;
  name: string;
  age: string;
  image: string;
  gender: string;
  dateOfBirth: string;
  birthOrder: string;
}

// Main Child Info Screen
export default function ChildInfoScreen({ navigation }: any) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const [children] = useState<Child[]>([
    {
      id: 1,
      name: "Maya Michaels",
      age: "9 month old",
      image: "https://i.pravatar.cc/150?img=1",
      gender: "Female",
      dateOfBirth: "06/05/2025",
      birthOrder: "First born",
    },
    {
      id: 2,
      name: "Joy Stephens",
      age: "5 month old",
      image: "https://i.pravatar.cc/150?img=2",
      gender: "Female",
      dateOfBirth: "10/09/2025",
      birthOrder: "Second born",
    },
  ]);

  const handleEditChild = (child: Child) => {
    setSelectedChild(child);
    setEditModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={ms(24)} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Child Info</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Children List */}
        {children.map((child) => (
          <View key={child.id} style={styles.childCard}>
            <Image source={{ uri: child.image }} style={styles.childAvatar} />
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childAge}>{child.age}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditChild(child)}
              accessibilityLabel={`Edit ${child.name}`}
              accessibilityRole="button"
            >
              <Feather name="edit-2" size={ms(20)} color={colors.textPrimary} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add Another Child Button - Fixed at Bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
          accessibilityLabel="Add another child"
          accessibilityRole="button"
        >
          <Text style={styles.addButtonText}>Add another child</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <EditChildModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedChild(null);
        }}
        child={selectedChild}
      />

      <AddChildModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    backgroundColor: colors.textWhite,
    gap: ms(spacing.md),
  },
  backButton: {
    padding: ms(spacing.xs),
  },
  headerTitle: {
    fontSize: typography.heading2.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollContent: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: ms(spacing.xl),
    paddingBottom: ms(spacing.xl),
  },
  childCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.textWhite,
    paddingVertical: ms(spacing.lg),
    paddingHorizontal: ms(spacing.lg),
    marginBottom: ms(spacing.lg),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  childAvatar: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    marginRight: ms(spacing.md),
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: typography.heading3.fontSize,
    fontFamily: fontFamilies.semiBold,
    color: colors.textPrimary,
    marginBottom: ms(spacing.xs / 2),
  },
  childAge: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  editButton: {
    flexDirection: "column",
    alignItems: "center",
    gap: ms(spacing.xs),
    paddingHorizontal: ms(spacing.sm),
  },
  editText: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.medium,
    color: colors.textPrimary,
  },
  addButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: ms(spacing.md),
    borderRadius: ms(12),
    alignItems: "center",
    backgroundColor: colors.textWhite,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.semiBold,
  },
  buttonContainer: {
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: ms(spacing.md),
    backgroundColor: colors.backgroundMain,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    marginBottom: ms(60),
  },
});