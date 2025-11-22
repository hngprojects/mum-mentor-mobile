import React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Header from "@/src/components/community/Header";
import PostCard from "@/src/components/community/PostCard";
import FloatingCreateButton from "@/src/components/community/FloatingCreateButton";
import EmptyFeed from "@/src/components/community/EmptyFeed";
import { useCommunityFeed } from "@/src/hooks/useCommunityFeed";
import { colors, spacing } from "@/src/core/styles";

export default function CommunityFeedScreen() {
  const { posts, loading, loadMore } = useCommunityFeed();

  return (
    <View style={styles.container}>
      <Header title="Community" />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          posts.length === 0 ? styles.emptyContainer : undefined
        }
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <EmptyFeed />
          )
        }
        ListFooterComponent={
          posts.length > 0 && loading ? (
            <ActivityIndicator
              style={{ marginVertical: spacing.md }}
              size="small"
              color={colors.primary}
            />
          ) : null
        }
      />

      <FloatingCreateButton href="/community/create" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
