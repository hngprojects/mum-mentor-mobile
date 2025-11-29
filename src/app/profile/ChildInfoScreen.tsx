// screens/ChildInfoScreen.tsx
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Style Imports ---
import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms } from "../../core/styles/scaling";

// --- Component Imports ---
import { AddChildModal } from "./AddChildModal";
import { EditChildModal } from "./EditChildModal";

// --- API Imports ---
import {
  getChildProfiles,
  deleteChildProfile,
  calculateAge,
} from "../../core/services/childProfile.service";
import { ChildProfile } from "../../types/child.types";

// Utils: Get stable avatar URL
const getStableAvatarUrl = (profilePictureUrl?: string): string => {
  if (!profilePictureUrl) {
    return "https://i.pravatar.cc/150?img=1";
  }
  
  // If it's already a full URL (including our avatar endpoint), return as-is
  if (profilePictureUrl.includes('child-profiles/avatar/')) {
    return profilePictureUrl;
  }
  
  // If it's already a full URL but not our avatar endpoint, use it directly
  if (profilePictureUrl.startsWith('http')) {
    return profilePictureUrl;
  }
  
  // Extract filename from the profile_picture_url
  let filename: string;
  
  if (profilePictureUrl.includes('/')) {
    filename = profilePictureUrl.split('/').pop() || '';
  } else {
    filename = profilePictureUrl;
  }
  
  // If we couldn't extract a valid filename, use placeholder
  if (!filename) {
    return "https://i.pravatar.cc/150?img=1";
  }
  
  // Construct the full avatar URL using the public endpoint
  const baseUrl = "https://api.staging.kaizen.emerj.net/api/v1";
  const avatarUrl = `${baseUrl}/child-profiles/avatar/${filename}`;
  
  return avatarUrl;
};

// Stable placeholder image
const PLACEHOLDER_IMAGE = "https://i.pravatar.cc/150?img=1";

// Main Child Info Screen
export default function ChildInfoScreen({ navigation }: any) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<{ [key: string]: { loaded: boolean; error: boolean; url: string } }>({});

  // Fetch children on mount
  useEffect(() => {
    fetchChildren();
  }, []);

  /**
   * Fetch all child profiles
   */
  const fetchChildren = async () => {
    try {
      setLoading(true);
      
      const profiles = await getChildProfiles();
      
      console.log("👶 Fetched child profiles:", profiles);
      
      // Defensive: ensure we always set an array
      if (Array.isArray(profiles)) {
        setChildren(profiles);
        
        // Pre-initialize image load states
        const initialLoadStates: { [key: string]: { loaded: boolean; error: boolean; url: string } } = {};
        profiles.forEach((child) => {
          const avatarUrl = getStableAvatarUrl(child.profile_picture_url);
          initialLoadStates[child.id] = {
            loaded: false,
            error: false,
            url: avatarUrl
          };
        });
        setImageLoadStates(initialLoadStates);
      } else {
        console.warn('⚠️ API returned non-array, setting empty array. Received:', profiles);
        setChildren([]);
        setImageLoadStates({});
      }
    } catch (error) {
      console.error("❌ Error fetching children:", error);
      Alert.alert(
        "Error",
        "Failed to load children profiles. Please try again."
      );
      setChildren([]);
      setImageLoadStates({});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Refresh children list
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setImageLoadStates({});
    fetchChildren();
  }, []);

  /**
   * Handle edit child
   */
  const handleEditChild = (child: ChildProfile) => {
    setSelectedChild(child);
    setEditModalVisible(true);
  };

  /**
   * Handle delete child with confirmation
   */
  const handleDeleteChild = (child: ChildProfile) => {
    Alert.alert(
      "Delete Child Profile",
      `Are you sure you want to delete ${child.full_name}'s profile? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteChildProfile(child.id);
              Alert.alert("Success", "Child profile deleted successfully");
              fetchChildren();
            } catch (error) {
              console.error("Error deleting child:", error);
              Alert.alert("Error", "Failed to delete child profile");
            }
          },
        },
      ]
    );
  };

  /**
   * Handle modal close and refresh data
   */
  const handleModalClose = () => {
    setEditModalVisible(false);
    setAddModalVisible(false);
    setSelectedChild(null);
    fetchChildren();
  };

  /**
   * Handle image load error
   */
  const handleImageError = useCallback((childId: string) => {
    console.log(`❌ Image failed to load for child ${childId}`);
    setImageLoadStates(prev => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        error: true,
        loaded: true
      }
    }));
  }, []);

  /**
   * Handle image load success
   */
  const handleImageLoad = useCallback((childId: string) => {
    console.log(`✅ Image loaded for child ${childId}`);
    setImageLoadStates(prev => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        loaded: true,
        error: false
      }
    }));
  }, []);

  /**
   * Get image source for child
   */
  const getImageSource = useCallback((child: ChildProfile) => {
    const loadState = imageLoadStates[child.id];
    
    if (!loadState) {
      // Not initialized yet, use calculated URL
      const avatarUrl = getStableAvatarUrl(child.profile_picture_url);
      return { uri: avatarUrl };
    }
    
    if (loadState.error || !child.profile_picture_url) {
      return { uri: PLACEHOLDER_IMAGE };
    }
    
    return { uri: loadState.url };
  }, [imageLoadStates]);

  /**
   * Memoized child list to prevent unnecessary re-renders
   */
  const renderedChildren = useMemo(() => {
    return children.map((child) => {
      const imageSource = getImageSource(child);
      const loadState = imageLoadStates[child.id];
      const isLoading = loadState && !loadState.loaded && !loadState.error;

      return (
        <View key={child.id} style={styles.childCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={imageSource}
              style={styles.childAvatar}
              onError={() => handleImageError(child.id)}
              onLoad={() => handleImageLoad(child.id)}
              resizeMode="cover"
              defaultSource={{ uri: PLACEHOLDER_IMAGE }}
            />
            {isLoading && (
              <View style={styles.imageLoadingOverlay}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
          </View>
          <View style={styles.childInfo}>
            <Text style={styles.childName}>{child.full_name}</Text>
            <Text style={styles.childAge}>
              {calculateAge(child.date_of_birth)}
            </Text>
            <Text style={styles.childDetails}>
              {child.gender} • {child.birth_order === 1 ? "First" : child.birth_order === 2 ? "Second" : child.birth_order === 3 ? "Third" : `${child.birth_order}th`} born
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditChild(child)}
              accessibilityLabel={`Edit ${child.full_name}`}
              accessibilityRole="button"
            >
              <Feather name="edit-2" size={ms(20)} color={colors.textPrimary} />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteChild(child)}
              accessibilityLabel={`Delete ${child.full_name}`}
              accessibilityRole="button"
            >
              <Feather name="trash-2" size={ms(20)} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  }, [children, imageLoadStates, getImageSource, handleImageError, handleImageLoad]);

  /**
   * Render loading state
   */
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading children...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Render empty state
   */
  if (children.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
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
        <View style={styles.emptyContainer}>
          <Feather name="users" size={ms(64)} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Children Added</Text>
          <Text style={styles.emptySubtitle}>
            Add your first child to get started
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
            accessibilityLabel="Add your first child"
            accessibilityRole="button"
          >
            <Text style={styles.addButtonText}>Add Your First Child</Text>
          </TouchableOpacity>
        </View>
        <AddChildModal
          visible={addModalVisible}
          onClose={handleModalClose}
        />
      </SafeAreaView>
    );
  }

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {renderedChildren}
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
        onClose={handleModalClose}
        child={selectedChild}
      />

      <AddChildModal
        visible={addModalVisible}
        onClose={handleModalClose}
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
  avatarContainer: {
    position: 'relative',
    marginRight: ms(spacing.md),
  },
  childAvatar: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: colors.backgroundSubtle,
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: ms(30),
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
    marginBottom: ms(spacing.xs / 4),
  },
  childDetails: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(spacing.sm),
  },
  editButton: {
    flexDirection: "column",
    alignItems: "center",
    gap: ms(spacing.xs / 2),
    paddingHorizontal: ms(spacing.sm),
  },
  editText: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: fontFamilies.medium,
    color: colors.textPrimary,
  },
  deleteButton: {
    padding: ms(spacing.sm),
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: ms(spacing.md),
  },
  loadingText: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ms(spacing.xl),
    gap: ms(spacing.md),
  },
  emptyTitle: {
    fontSize: typography.heading2.fontSize,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    textAlign: "center",
  },
});