// src/app/(tabs)/Community.tsx

import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fontFamilies, spacing, typography } from "../../core/styles";
import { ms, rfs, vs } from "../../core/styles/scaling";

import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

type ImageSource = ImageSourcePropType;

type CommunityPost = {
  id: string;
  authorName: string;
  authorAvatar: ImageSource;
  timeAgo: string;
  text: string;
  image?: ImageSource;
  likes: number;
  comments: number;
  isLiked: boolean;
};

const avatar = require("../../assets/images/profile-image.png");
const placeholderImage = require("../../assets/images/home-image.png");

// Mock gallery images just to simulate the "select photos" screen
const GALLERY_IMAGES: ImageSource[] = [
  require("../../assets/images/home-image.png"),
  require("../../assets/images/task-icon.png"),
  require("../../assets/images/resource-icon.png"),
  require("../../assets/images/journal-icon.png"),
  require("../../assets/images/notification.png"),
  require("../../assets/images/user.png"),
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "1",
    authorName: "Mum Mentor Community",
    authorAvatar: avatar,
    timeAgo: "2h",
    text:
      "My baby has been waking up every 2 hours at night. Any mums dealing with this too? What helped you?",
    image: placeholderImage,
    likes: 24,
    comments: 6,
    isLiked: false,
  },
  {
    id: "2",
    authorName: "Oluwatobi",
    authorAvatar: avatar,
    timeAgo: "5h",
    text:
      "Shared a little win today – my toddler finally tried veggies without a fight 🎉",
    likes: 15,
    comments: 3,
    isLiked: false,
  },
];

const Community: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isGalleryModalVisible, setIsGalleryModalVisible] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [isDeleteSuccessVisible, setIsDeleteSuccessVisible] = useState(false);
  const [isPostDetailVisible, setIsPostDetailVisible] = useState(false);

  const [createText, setCreateText] = useState("");
  const [createImage, setCreateImage] = useState<ImageSource | undefined>();

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postIdForOptions, setPostIdForOptions] = useState<string | null>(null);
  const [postIdForDelete, setPostIdForDelete] = useState<string | null>(null);

  const selectedPost = useMemo(
    () => posts.find((p) => p.id === selectedPostId) || null,
    [posts, selectedPostId]
  );

  const postForOptions = useMemo(
    () => posts.find((p) => p.id === postIdForOptions) || null,
    [posts, postIdForOptions]
  );

  const postForDelete = useMemo(
    () => posts.find((p) => p.id === postIdForDelete) || null,
    [posts, postIdForDelete]
  );

  // ---- Actions ----

  const openCreateModal = () => {
    setCreateText("");
    setCreateImage(undefined);
    setIsCreateModalVisible(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  const handleSubmitPost = () => {
    if (!createText.trim() && !createImage) {
      return;
    }

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      authorName: "You",
      authorAvatar: avatar,
      timeAgo: "Just now",
      text: createText.trim(),
      image: createImage,
      likes: 0,
      comments: 0,
      isLiked: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    setIsCreateModalVisible(false);
    setCreateText("");
    setCreateImage(undefined);
  };

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const openOptionsForPost = (id: string) => {
    setPostIdForOptions(id);
    setIsOptionsModalVisible(true);
  };

  const closeOptionsModal = () => {
    setIsOptionsModalVisible(false);
    setPostIdForOptions(null);
  };

  const openDeleteConfirm = () => {
    if (!postForOptions) return;
    setPostIdForDelete(postForOptions.id);
    setIsOptionsModalVisible(false);
    setIsDeleteConfirmVisible(true);
  };

  const confirmDeletePost = () => {
    if (!postIdForDelete) return;

    setPosts((prev) => prev.filter((p) => p.id !== postIdForDelete));
    setIsDeleteConfirmVisible(false);
    setPostIdForDelete(null);
    setIsDeleteSuccessVisible(true);
  };

  const openGallery = () => {
    setIsGalleryModalVisible(true);
  };

  const selectGalleryImage = (img: ImageSource) => {
    setCreateImage(img);
    setIsGalleryModalVisible(false);
  };

  const openPostDetail = (id: string) => {
    setSelectedPostId(id);
    setIsPostDetailVisible(true);
  };

  const closePostDetail = () => {
    setIsPostDetailVisible(false);
    setSelectedPostId(null);
  };

  // ---- Render helpers ----

  const renderPostItem = ({ item }: { item: CommunityPost }) => (
    <Pressable onPress={() => openPostDetail(item.id)} style={styles.postCard}>
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <Image source={item.authorAvatar} style={styles.avatar} />
          <View>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <Text style={styles.postMeta}>{item.timeAgo}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => openOptionsForPost(item.id)}
          accessibilityRole="button"
          accessibilityLabel="Post options"
        >
          <Text style={styles.moreText}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <Text style={styles.postText}>{item.text}</Text>

      {item.image && (
        <Image source={item.image} style={styles.postImage} resizeMode="cover" />
      )}

      {/* Footer */}
      <View style={styles.postFooter}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => handleToggleLike(item.id)}
        >
          <Text
            style={[
              styles.footerButtonText,
              item.isLiked && styles.footerButtonTextActive,
            ]}
          >
            ♥ {item.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => openPostDetail(item.id)}
        >
          <Text style={styles.footerButtonText}>💬 {item.comments}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  // ---- Main Render ----

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundMain} />

      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSubtitle}>
            Connect with mums, ask questions and share your journey.
          </Text>
        </View>

        {/* Feed */}
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={renderPostItem}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Floating create button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={openCreateModal}
          accessibilityRole="button"
          accessibilityLabel="Create new post"
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Create Post Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        onRequestClose={closeCreateModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeCreateModal}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity
              disabled={!createText.trim() && !createImage}
              onPress={handleSubmitPost}
            >
              <Text
                style={[
                  styles.modalPostButton,
                  !createText.trim() && !createImage &&
                    styles.modalPostButtonDisabled,
                ]}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={{ paddingBottom: vs(40) }}
          >
            <View style={styles.createRow}>
              <Image source={avatar} style={styles.avatar} />
              <Text style={styles.createAuthor}>Posting as You</Text>
            </View>

            <TextInput
              style={styles.textInput}
              value={createText}
              onChangeText={setCreateText}
              placeholder="Write something..."
              placeholderTextColor={colors.textGrey2}
              multiline
            />

            {createImage && (
              <Image
                source={createImage}
                style={styles.selectedImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.createActions}>
              <SecondaryButton
                title="Add photo"
                onPress={openGallery}
                style={styles.addPhotoButton}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Gallery Modal */}
      <Modal
        visible={isGalleryModalVisible}
        animationType="slide"
        onRequestClose={() => setIsGalleryModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsGalleryModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Photo</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.galleryGrid}>
            {GALLERY_IMAGES.map((img, index) => (
              <TouchableOpacity
                key={String(index)}
                style={styles.galleryItem}
                onPress={() => selectGalleryImage(img)}
              >
                <Image source={img} style={styles.galleryImage} />
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Post Options Bottom Sheet */}
      <Modal
        visible={isOptionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeOptionsModal}
      >
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Post options</Text>

            <TouchableOpacity
              style={styles.sheetButton}
              onPress={() => {
                // Simple UX: open in detail view for "edit"
                if (postForOptions) {
                  openPostDetail(postForOptions.id);
                }
                closeOptionsModal();
              }}
            >
              <Text style={styles.sheetButtonText}>Edit Post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sheetButton, styles.sheetButtonDestructive]}
              onPress={openDeleteConfirm}
            >
              <Text style={[styles.sheetButtonText, styles.sheetButtonTextDanger]}>
                Delete Post
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetCancel} onPress={closeOptionsModal}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteConfirmVisible(false)}
      >
        <View style={styles.centerOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Delete post?</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </Text>

            <View style={styles.confirmButtons}>
              <SecondaryButton
                title="Cancel"
                onPress={() => setIsDeleteConfirmVisible(false)}
                style={styles.confirmButton}
              />
              <PrimaryButton
                title="Delete"
                onPress={confirmDeletePost}
                style={styles.confirmDeleteButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Success Modal */}
      <Modal
        visible={isDeleteSuccessVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteSuccessVisible(false)}
      >
        <View style={styles.centerOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Post deleted</Text>
            <PrimaryButton
              title="Okay"
              onPress={() => setIsDeleteSuccessVisible(false)}
              style={styles.successButton}
            />
          </View>
        </View>
      </Modal>

      {/* Full Post Modal */}
      <Modal
        visible={isPostDetailVisible && !!selectedPost}
        animationType="slide"
        onRequestClose={closePostDetail}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closePostDetail}>
              <Text style={styles.modalCancel}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Post</Text>
            <View style={{ width: 60 }} />
          </View>

          {selectedPost && (
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={{ paddingBottom: vs(40) }}
            >
              <View style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postHeaderLeft}>
                    <Image
                      source={selectedPost.authorAvatar}
                      style={styles.avatar}
                    />
                    <View>
                      <Text style={styles.authorName}>
                        {selectedPost.authorName}
                      </Text>
                      <Text style={styles.postMeta}>{selectedPost.timeAgo}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.postText}>{selectedPost.text}</Text>

                {selectedPost.image && (
                  <Image
                    source={selectedPost.image}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.postFooter}>
                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => handleToggleLike(selectedPost.id)}
                  >
                    <Text
                      style={[
                        styles.footerButtonText,
                        selectedPost.isLiked && styles.footerButtonTextActive,
                      ]}
                    >
                      ♥ {selectedPost.likes}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>
                      💬 {selectedPost.comments} comments
                    </Text>
                  </View>
                </View>
              </View>

              {/* Simple static comments area */}
              <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>Comments</Text>
                <Text style={styles.emptyCommentsText}>
                  Comments will appear here.
                </Text>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(10),
    paddingBottom: vs(4),
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    marginTop: vs(4),
    ...typography.bodySmall,
    color: colors.textGrey2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: ms(spacing.lg),
    paddingBottom: vs(100),
  },
  postCard: {
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    padding: ms(spacing.md),
    marginTop: vs(12),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(8),
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    marginRight: ms(8),
  },
  authorName: {
    fontFamily: fontFamilies.semiBold,
    fontSize: rfs(14),
    color: colors.textPrimary,
  },
  postMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: rfs(12),
    color: colors.textGrey2,
  },
  moreText: {
    fontFamily: fontFamilies.bold,
    fontSize: rfs(18),
    color: colors.textGrey2,
  },
  postText: {
    marginTop: vs(4),
    fontFamily: fontFamilies.regular,
    fontSize: rfs(14),
    color: colors.textPrimary,
  },
  postImage: {
    marginTop: vs(8),
    borderRadius: ms(12),
    width: "100%",
    height: vs(200),
  },
  postFooter: {
    flexDirection: "row",
    marginTop: vs(8),
  },
  footerButton: {
    marginRight: ms(16),
  },
  footerButtonText: {
    fontFamily: fontFamilies.medium,
    fontSize: rfs(12),
    color: colors.textGrey2,
  },
  footerButtonTextActive: {
    color: colors.primary,
  },

  fab: {
    position: "absolute",
    right: ms(20),
    bottom: vs(30),
    width: ms(56),
    height: ms(56),
    borderRadius: ms(28),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: {
    color: colors.textWhite,
    fontSize: rfs(28),
    marginTop: -2,
  },

  // Create Post
  modalContainer: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ms(spacing.lg),
    paddingVertical: vs(12),
  },
  modalCancel: {
    fontFamily: fontFamilies.regular,
    fontSize: rfs(14),
    color: colors.textGrey2,
  },
  modalTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: rfs(16),
    color: colors.textPrimary,
  },
  modalPostButton: {
    fontFamily: fontFamilies.semiBold,
    fontSize: rfs(14),
    color: colors.primary,
  },
  modalPostButtonDisabled: {
    color: colors.textGrey2,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: ms(spacing.lg),
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(12),
    marginBottom: vs(12),
  },
  createAuthor: {
    fontFamily: fontFamilies.medium,
    fontSize: rfs(14),
    color: colors.textPrimary,
  },
  textInput: {
    minHeight: vs(120),
    textAlignVertical: "top",
    fontFamily: fontFamilies.regular,
    fontSize: rfs(14),
    color: colors.textPrimary,
  },
  selectedImage: {
    marginTop: vs(12),
    borderRadius: ms(12),
    width: "100%",
    height: vs(200),
  },
  createActions: {
    marginTop: vs(20),
  },
  addPhotoButton: {
    alignSelf: "flex-start",
  },

  // Gallery
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(12),
  },
  galleryItem: {
    width: "30%",
    aspectRatio: 1,
    margin: "1.5%",
    borderRadius: ms(10),
    overflow: "hidden",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },

  // Bottom sheet
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    backgroundColor: colors.textWhite,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingHorizontal: ms(spacing.lg),
    paddingTop: vs(8),
    paddingBottom: vs(20),
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
    marginBottom: vs(8),
  },
  sheetTitle: {
    fontFamily: fontFamilies.medium,
    fontSize: rfs(14),
    color: colors.textPrimary,
    marginBottom: vs(12),
  },
  sheetButton: {
    paddingVertical: vs(10),
  },
  sheetButtonDestructive: {
    marginTop: vs(4),
  },
  sheetButtonText: {
    fontFamily: fontFamilies.regular,
    fontSize: rfs(14),
    color: colors.textPrimary,
  },
  sheetButtonTextDanger: {
    color: colors.error,
  },
  sheetCancel: {
    marginTop: vs(10),
  },
  sheetCancelText: {
    fontFamily: fontFamilies.medium,
    fontSize: rfs(14),
    color: colors.textGrey2,
    textAlign: "center",
  },

  // Confirm / success
  centerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  confirmCard: {
    width: "80%",
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    padding: ms(spacing.lg),
  },
  confirmTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: rfs(16),
    color: colors.textPrimary,
    marginBottom: vs(8),
  },
  confirmText: {
    fontFamily: fontFamilies.regular,
    fontSize: rfs(13),
    color: colors.textGrey2,
    marginBottom: vs(16),
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  confirmButton: {
    flex: 1,
    marginRight: ms(8),
  },
  confirmDeleteButton: {
    flex: 1,
  },
  successCard: {
    width: "70%",
    backgroundColor: colors.textWhite,
    borderRadius: ms(16),
    padding: ms(spacing.lg),
    alignItems: "center",
  },
  successIconCircle: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: colors.successLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(12),
  },
  successIconText: {
    fontFamily: fontFamilies.bold,
    fontSize: rfs(26),
    color: colors.success,
  },
  successTitle: {
    fontFamily: fontFamilies.medium,
    fontSize: rfs(16),
    color: colors.textPrimary,
    marginBottom: vs(12),
  },
  successButton: {
    width: "100%",
  },

  // Comments
  commentsSection: {
    marginTop: vs(16),
  },
  commentsTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: rfs(14),
    color: colors.textPrimary,
    marginBottom: vs(8),
  },
  emptyCommentsText: {
    fontFamily: fontFamilies.regular,
    fontSize: rfs(13),
    color: colors.textGrey2,
  },
});