// src/app/(tabs)/Journal.tsx

import { colors, spacing, typography } from "@/src/core/styles";
import { ms, rfs, vs } from '@/src/core/styles/scaling';
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from 'react';
import { 
  Image, 
  Platform, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import DeleteModal from "../components/journal/deleteModal";
import EditForm, { categories } from "../components/journal/editForm";
import JournalCard, { JournalItems, journalEntries } from "../components/journal/journalCard";
import JournalDetails from "../components/journal/journalDetails";
import { router } from "expo-router";

interface Category {
  title: string;
  color?: string;
  bgColor?: string;
}

export default function JournalScreen() {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Initialize data with state, so we can update it (delete/add)
  const [journalData, setJournalData] = useState<JournalItems[]>(journalEntries);
  const [filteredData, setFilteredData] = useState<JournalItems[]>(journalEntries);
  
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  
  const [selectedJournal, setSelectedJournal] = useState<JournalItems>({
    id: 0,
    title: "",
    //@ts-ignore
    imageUrl: "",
    mood: "",
    thoughts: "",
    date: "",
    category: "",
  });

  // Filter Logic
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredData(journalData);
    } else {
      const filtered = journalData.filter(item => item.category === activeCategory);
      setFilteredData(filtered);
    }
  }, [activeCategory, journalData]);

  const handleSelectJournal = (item: JournalItems) => {
    setSelectedJournal(item);
    setShowDetails(true);
  };

  const handleConfirmDelete = () => {
    const remaining = journalData.filter(item => item.id !== selectedJournal.id);
    setJournalData(remaining);
    setShowDetails(false);
    setIsDeleteModalVisible(false);
  };

  const handleBack = () => {
    if (showDetails) {
      setShowDetails(false);
    }
  };

  const handleEdit = () => {
    if (selectedJournal) {
      setIsEditing(true);
      setIsEditModalVisible(true);
    }
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    setIsEditModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => {
              showDetails ? handleBack() :router.back() 
            }} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {showDetails ? "Details" : "My Journal"}
          </Text>
        </View>

        {showDetails && (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
               {/* Using Ionicons instead of SVGs for stability */}
               <Ionicons name="create-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)} style={styles.actionButton}>
               <Ionicons name="trash-outline" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 2. Main Content */}
      <View style={styles.contentContainer}>
        {journalData.length === 0 ? (
          // Empty State
          <View style={styles.emptyState}>
            <Image 
              source={require('../assets/images/journal/note.png')} 
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No journal entries yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first entry to start tracking your thoughts, goals, or memories.
            </Text>
          </View>
        ) : (
          <>
            {/* Categories (Only visible on List View) */}
            {!showDetails && (
              <View style={styles.categoryContainer}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScroll}
                >
                  <TouchableOpacity 
                    onPress={() => setActiveCategory("all")}
                    style={[
                      styles.categoryTab, 
                      activeCategory === "all" && styles.categoryTabActive
                    ]}
                  >
                    <Text style={[
                      styles.categoryTabText,
                      activeCategory === "all" && styles.categoryTabTextActive
                    ]}>All</Text>
                  </TouchableOpacity>

                  {categories.map((category) => (
                    <TouchableOpacity 
                      key={category.title}
                      onPress={() => setActiveCategory(category.title)}
                      style={[
                        styles.categoryTab, 
                        activeCategory === category.title && styles.categoryTabActive
                      ]}
                    >
                      <Text style={[
                        styles.categoryTabText,
                        activeCategory === category.title && styles.categoryTabTextActive
                      ]}>
                        {category.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Content Body */}
            {showDetails ? (
              <View style={{ flex: 1, paddingHorizontal: ms(spacing.lg) }}>
                <JournalDetails journal={selectedJournal} />
              </View>
            ) : (
              <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.listContent}
              >
                {filteredData.map((card) => (
                  <TouchableOpacity 
                    key={card.id} 
                    onPress={() => handleSelectJournal(card)}
                    activeOpacity={0.7}
                  >
                    <JournalCard journal={card} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </>
        )}
      </View>

      {/* 3. Floating Action Button (Only on List View) */}
      {!showDetails && (
        <TouchableOpacity 
          onPress={handleCreateNew} 
          style={styles.fab}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* 4. Modals */}
      {isEditModalVisible && (
        <EditForm 
          isEditing={isEditing} 
          visible={isEditModalVisible} 
          onClose={() => setIsEditModalVisible(false)} 
          existingEntry={isEditing ? selectedJournal : undefined}
        />
      )}

      {showDetails && isDeleteModalVisible && (
        <DeleteModal 
          onConfirm={handleConfirmDelete} 
          onCancel={() => setIsDeleteModalVisible(false)} 
          visible={isDeleteModalVisible}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  contentContainer: {
    flex: 1, // This fixes the scrolling issue
  },
  
  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ms(spacing.lg),
    paddingTop: Platform.OS === 'android' ? vs(10) : 0,
    paddingBottom: vs(spacing.md),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(8),
  },
  backButton: {
    padding: ms(4),
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    gap: ms(16),
  },
  actionButton: {
    padding: ms(4),
  },

  // Category Styles
  categoryContainer: {
    marginBottom: vs(spacing.sm),
  },
  sectionTitle: {
    ...typography.labelLarge,
    paddingHorizontal: ms(spacing.lg),
    marginBottom: vs(12),
    color: colors.textPrimary,
  },
  categoryScroll: {
    paddingHorizontal: ms(spacing.lg),
    gap: ms(16),
    paddingBottom: vs(8),
  },
  categoryTab: {
    paddingVertical: vs(8),
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  categoryTabActive: {
    borderColor: colors.primary,
  },
  categoryTabText: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
  },
  categoryTabTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  // List Styles
  listContent: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(spacing.sm),
    paddingBottom: vs(100), // Space for FAB
    gap: vs(16),
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(40),
  },
  emptyImage: {
    width: ms(120),
    height: ms(120),
    marginBottom: vs(24),
  },
  emptyTitle: {
    ...typography.heading3,
    marginBottom: vs(8),
    textAlign: "center",
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: "center",
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: vs(40),
    right: ms(30),
    width: ms(56),
    height: ms(56),
    borderRadius: ms(16),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});