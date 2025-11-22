import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "@/src/components/community/Header";
import PostCard from "@/src/components/community/PostCard";
import { getPostById } from "@/src/services/community.api";
import { colors, spacing } from "@/src/core/styles";
import type { CommunityPost } from "@/src/states/community/communityTypes";

export default function PostDetailsScreen() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!postId || typeof postId !== "string") return;
      const data = await getPostById(postId);
      setPost(data as CommunityPost);
      setLoading(false);
    };

    run();
  }, [postId]);

  if (loading || !post) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Post" />
      <View style={styles.content}>
        <PostCard post={post} full />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  content: {
    padding: spacing.md,
  },
});
