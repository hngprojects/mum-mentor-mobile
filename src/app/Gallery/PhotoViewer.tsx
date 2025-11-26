// src/app/gallery/photo-viewer.tsx

import { colors, spacing, typography } from "@/src/core/styles";
import { ms, rfs, vs } from "@/src/core/styles/scaling";
import { showToast } from "@/src/core/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import EmptyState from "../components/shared/EmptyState";
import PageHeader from "../components/shared/PageHeader";

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - ms(spacing.lg * 2) - ms(spacing.sm * 2)) / 3;

// Mock photo data - Replace with real data from your gallery service
interface Photo {
  id: string;
  uri: string;
  date: string;
  category?: string;
  memory?: {
    pregnancy?: string;
    video?: string;
    gender?: string;
  };
}

interface Album {
  id: string;
  name: string;
  photos: Photo[];
  createdAt: string;
  isPrivate: boolean;
}

// Mock data
const MOCK_ALBUM: Album = {
  id: "1",
  name: "Baby Photos",
  photos: [
    {
      id: "1",
      uri: "https://picsum.photos/400/400?random=1",
      date: "2024-01-15",
      category: "baby",
      memory: {
        pregnancy: "Week 20",
        gender: "Boy",
      },
    },
    {
      id: "2",
      uri: "https://picsum.photos/400/400?random=2",
      date: "2024-01-16",
      category: "smiles",
    },
    {
      id: "3",
      uri: "https://picsum.photos/400/400?random=3",
      date: "2024-01-17",
      category: "toy",
    },
    {
      id: "4",
      uri: "https://picsum.photos/400/400?random=4",
      date: "2024-01-18",
      category: "baby",
    },
    {
      id: "5",
      uri: "https://picsum.photos/400/400?random=5",
      date: "2024-01-19",
      category: "milestones",
    },
    {
      id: "6",
      uri: "https://picsum.photos/400/400?random=6",
      date: "2024-01-20",
      category: "family",
    },
  ],
  createdAt: "2024-01-15",
  isPrivate: false,
};

export default function PhotoViewerScreen() {
  const params = useLocalSearchParams();
  const albumId = params.albumId as string;
  const photoId = params.photoId as string; // If viewing single photo

  const [album, setAlbum] = useState<Album | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlbumData();
  }, [albumId]);

  useEffect(() => {
    // If photoId is provided, open that photo in full screen
    if (photoId && album) {
      const photo = album.photos.find((p) => p.id === photoId);
      if (photo) {
        setSelectedPhoto(photo);
        setIsFullScreenVisible(true);
      }
    }
  }, [photoId, album]);

  const loadAlbumData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const albumData = await galleryService.getAlbum(albumId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAlbum(MOCK_ALBUM);
    } catch (error) {
      console.error("Error loading album:", error);
      showToast.error("Error", "Failed to load album");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoPress = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsFullScreenVisible(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenVisible(false);
    setSelectedPhoto(null);
  };

  const handleAddPhoto = () => {
    router.push({
      pathname: "./gallery/SelectionGrid",
      params: { type: "categories", albumId },
    });
  };

  const handleEditAlbum = () => {
    router.push({
      pathname: "./gallery/ModalForm",
      params: { type: "edit-album", albumId },
    });
  };

  const handleDeletePhoto = (photoId: string) => {
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // TODO: Call delete API
            console.log("Deleting photo:", photoId);

            // Update local state
            if (album) {
              setAlbum({
                ...album,
                photos: album.photos.filter((p) => p.id !== photoId),
              });
            }

            handleCloseFullScreen();
            showToast.success("Success", "Photo deleted successfully");
          } catch (error) {
            console.error("Error deleting photo:", error);
            showToast.error("Error", "Failed to delete photo");
          }
        },
      },
    ]);
  };

  const renderPhoto = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => handlePhotoPress(item)}
    >
      <Image source={{ uri: item.uri }} style={styles.photoImage} />
    </TouchableOpacity>
  );

  const renderFullScreenPhoto = () => {
    if (!selectedPhoto) return null;

    return (
      <Modal
        visible={isFullScreenVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={handleCloseFullScreen}
      >
        <StatusBar style="light" />
        <View style={styles.fullScreenContainer}>
          {/* Header */}
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity onPress={handleCloseFullScreen}>
              <Ionicons name="close" size={32} color={colors.textWhite} />
            </TouchableOpacity>

            <View style={styles.fullScreenActions}>
              <TouchableOpacity
                style={styles.fullScreenActionButton}
                onPress={() => {
                  // TODO: Implement share functionality
                  showToast.warning("Share", "Share functionality coming soon");
                }}
              >
                <Ionicons
                  name="share-outline"
                  size={28}
                  color={colors.textWhite}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fullScreenActionButton}
                onPress={() => handleDeletePhoto(selectedPhoto.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={28}
                  color={colors.textWhite}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>

          {/* Memory Details */}
          {selectedPhoto.memory && (
            <View style={styles.memoryDetails}>
              <ScrollView
                contentContainerStyle={styles.memoryDetailsContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.memoryDate}>{selectedPhoto.date}</Text>

                {selectedPhoto.memory.pregnancy && (
                  <View style={styles.memoryItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={colors.textWhite}
                    />
                    <Text style={styles.memoryText}>
                      Pregnancy: {selectedPhoto.memory.pregnancy}
                    </Text>
                  </View>
                )}

                {selectedPhoto.memory.gender && (
                  <View style={styles.memoryItem}>
                    <Ionicons
                      name="male-female-outline"
                      size={20}
                      color={colors.textWhite}
                    />
                    <Text style={styles.memoryText}>
                      Gender: {selectedPhoto.memory.gender}
                    </Text>
                  </View>
                )}

                {selectedPhoto.category && (
                  <View style={styles.memoryItem}>
                    <Ionicons
                      name="pricetag-outline"
                      size={20}
                      color={colors.textWhite}
                    />
                    <Text style={styles.memoryText}>
                      Category: {selectedPhoto.category}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <PageHeader title="Loading..." showBack />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      </View>
    );
  }

  if (!album) {
    return (
      <View style={styles.container}>
        <PageHeader title="Album" showBack />
        <EmptyState
          icon="alert-circle-outline"
          title="Album Not Found"
          subtitle="This album doesn't exist or has been deleted"
          buttonText="Go Back"
          onButtonPress={() => router.back()}
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <PageHeader
          title={album.name}
          showBack
          rightIcon="ellipsis-horizontal"
          onRightPress={handleEditAlbum}
        />

        {/* Album Info */}
        <View style={styles.albumInfo}>
          <Text style={styles.photoCount}>
            {album.photos.length}{" "}
            {album.photos.length === 1 ? "photo" : "photos"}
          </Text>
          {album.isPrivate && (
            <View style={styles.privateBadge}>
              <Ionicons name="lock-closed" size={14} color={colors.textWhite} />
              <Text style={styles.privateBadgeText}>Private</Text>
            </View>
          )}
        </View>

        {/* Photos Grid */}
        {album.photos.length === 0 ? (
          <EmptyState
            icon="images-outline"
            title="No Photos Yet"
            subtitle="Start adding photos to this album"
            buttonText="Add Photo"
            onButtonPress={handleAddPhoto}
          />
        ) : (
          <FlatList
            data={album.photos}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.photoGrid}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Add Photo Button */}
        {album.photos.length > 0 && (
          <View style={styles.addPhotoButton}>
            <PrimaryButton title="Add Photo" onPress={handleAddPhoto} />
          </View>
        )}

        {/* Full Screen Photo Modal */}
        {renderFullScreenPhoto()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...typography.bodyLarge,
    color: colors.textGrey1,
  },
  albumInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ms(spacing.lg),
    paddingBottom: vs(spacing.md),
  },
  photoCount: {
    ...typography.bodyMedium,
    color: colors.textGrey1,
  },
  privateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: ms(spacing.sm),
    paddingVertical: vs(spacing.xs),
    borderRadius: ms(12),
    gap: ms(4),
  },
  privateBadgeText: {
    ...typography.caption,
    color: colors.textWhite,
    fontSize: rfs(11),
  },
  photoGrid: {
    paddingHorizontal: ms(spacing.lg),
    paddingBottom: vs(100),
  },
  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    margin: ms(spacing.xs),
    borderRadius: ms(8),
    overflow: "hidden",
    backgroundColor: colors.backgroundSubtle,
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  addPhotoButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: ms(spacing.lg),
    paddingBottom: vs(spacing.xl),
    backgroundColor: colors.backgroundMain,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },

  // Full Screen Styles
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.textPrimary,
  },
  fullScreenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(60),
    paddingBottom: vs(spacing.md),
  },
  fullScreenActions: {
    flexDirection: "row",
    gap: ms(spacing.md),
  },
  fullScreenActionButton: {
    padding: ms(spacing.xs),
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: width,
    height: "100%",
  },
  memoryDetails: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: vs(spacing.lg),
    maxHeight: vs(200),
  },
  memoryDetailsContent: {
    paddingBottom: vs(spacing.md),
  },
  memoryDate: {
    ...typography.heading3,
    color: colors.textWhite,
    marginBottom: vs(spacing.md),
  },
  memoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(spacing.sm),
    marginBottom: vs(spacing.sm),
  },
  memoryText: {
    ...typography.bodyMedium,
    color: colors.textWhite,
  },
});
