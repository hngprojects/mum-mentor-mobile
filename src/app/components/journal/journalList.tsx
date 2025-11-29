"use client";

import { colors, spacing, typography } from "@/src/core/styles";
import { ms, vs } from "@/src/core/styles/scaling";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeleteModal from "./deleteModal";
import EditForm from "./editForm";
import JournalCard, { type JournalItems } from "./journalCard";
import { useJournal } from "./journalContext";
import JournalDetails from "./journalDetails";

const JournalList = () => {
  const router = useRouter();
  const { journalEntries, isLoading, refreshEntries } = useJournal();

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalItems | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleAddNew = () => {
    setSelectedEntry(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (entry: JournalItems) => {
    setSelectedEntry(entry);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (entry: JournalItems) => {
    setSelectedEntry(entry);
    setShowDetails(true);
  };

  const handleDeletePress = (entry: JournalItems) => {
    setSelectedEntry(entry);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setSelectedEntry(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshEntries();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your journal...</Text>
      </View>
    );
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="book-outline" size={48} color={colors.textGrey1} />
      </View>
      <Text style={styles.emptyTitle}>No journal entries yet</Text>
      <Text style={styles.emptySubtitle}>
        Start documenting your journey by adding your first entry
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Add First Entry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: JournalItems }) => (
    <TouchableOpacity onPress={() => handleView(item)} activeOpacity={0.7}>
      <View style={styles.cardWrapper}>
        <JournalCard journal={item} />
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeletePress(item)}
          >
            <Ionicons name="trash-outline" size={18} color="#B2243B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Journal</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Entry count */}
      <Text style={styles.entryCount}>
        {journalEntries.length}{" "}
        {journalEntries.length === 1 ? "entry" : "entries"}
      </Text>

      {/* List */}
      <FlatList
        data={journalEntries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          journalEntries.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      {/* Edit/Create Modal */}
      <EditForm
        visible={showForm}
        isEditing={isEditing}
        existingEntry={
          selectedEntry
            ? {
                id: selectedEntry.id,
                title: selectedEntry.title,
                date: selectedEntry.date,
                category: selectedEntry.category,
                mood: selectedEntry.mood,
                imageUrl: selectedEntry.imageUrl,
                thoughts: selectedEntry.thoughts,
              }
            : undefined
        }
        onClose={() => {
          setShowForm(false);
          setSelectedEntry(null);
        }}
      />

      {/* Details Modal */}
      {selectedEntry && showDetails && (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.detailsOverlay}>
            <View style={styles.detailsHeader}>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
              <Text style={styles.detailsTitle}>Entry Details</Text>
              <View style={{ width: 24 }} />
            </View>
            <JournalDetails journal={selectedEntry} />
          </View>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={showDeleteModal}
        entryId={selectedEntry?.id ?? null}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedEntry(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ms(spacing.md),
    paddingTop: vs(spacing.lg),
    paddingBottom: vs(spacing.sm),
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  entryCount: {
    ...typography.bodySmall,
    color: colors.textGrey1,
    paddingHorizontal: ms(spacing.md),
    marginBottom: vs(spacing.sm),
  },
  listContent: {
    paddingHorizontal: ms(spacing.md),
    paddingBottom: vs(spacing.xl),
  },
  emptyListContent: {
    flex: 1,
  },
  cardWrapper: {
    position: "relative",
  },
  actionButtons: {
    position: "absolute",
    right: ms(spacing.md),
    top: ms(spacing.md),
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSubtle,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FBEAED",
  },
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundMain,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    marginTop: vs(spacing.md),
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(spacing.xl),
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundSubtle,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(spacing.lg),
  },
  emptyTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: vs(spacing.sm),
    textAlign: "center",
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
    textAlign: "center",
    marginBottom: vs(spacing.lg),
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: vs(spacing.md),
    borderRadius: 8,
  },
  emptyButtonText: {
    ...typography.labelMedium,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  // Details overlay styles
  detailsOverlay: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
    paddingTop: vs(50),
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ms(spacing.md),
    paddingBottom: vs(spacing.md),
  },
  detailsTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xs,
  },
});

export default JournalList;
