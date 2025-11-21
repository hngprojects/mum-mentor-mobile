// src/features/community/screens/CommunityFeedScreen.tsx

import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useFetchPosts } from '../hooks/useFetchPosts';
import { PostCard } from '../components/PostCard';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing } from '@/core/styles';
import { useRouter } from 'expo-router';

export const CommunityFeedScreen: React.FC = () => {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useFetchPosts();

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={data ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => router.push(`/community/${item.id}`)}
            onPressComment={() => router.push(`/community/${item.id}`)}
          />
        )}
        ListEmptyComponent={!isLoading ? <EmptyState /> : null}
        refreshControl={
          <RefreshControl
            tintColor={colors.primary}
            refreshing={isLoading || isRefetching}
            onRefresh={refetch}
          />
        }
      />

      {/* Floating button */}
      <View style={styles.fabContainer}>
        <View style={styles.fab} onTouchEnd={() => router.push('/community/create')}>
          {/* You can replace with an Icon later */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSoft,
  },
  listContent: {
    padding: spacing.md,
  },
  fabContainer: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
});
