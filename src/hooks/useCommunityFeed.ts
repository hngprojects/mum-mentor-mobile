// src/hooks/useCommunityFeed.ts

import { useEffect } from "react";
import { useCommunityStore } from "@/state/community/communityStore";
import {
  fetchCommunityFeed,
  loadMorePosts,
} from "@/services/community/community.api";

export const useCommunityFeed = () => {
  const { posts, page, loading, hasMore } = useCommunityStore();
  const store = useCommunityStore();

  // INITIAL LOAD
  useEffect(() => {
    (async () => {
      const data = await fetchCommunityFeed(1);
      store.setState({ posts: data, page: 1 });
    })();
  }, []);

  // LOAD MORE
  const loadMore = async () => {
    if (!hasMore || loading) return;

    store.setState({ loading: true });

    const more = await loadMorePosts(page + 1);

    store.setState({
      posts: [...posts, ...more],
      page: page + 1,
      hasMore: more.length > 0,
      loading: false,
    });
  };

  return {
    posts,
    loading,
    hasMore,
    loadMore,
  };
};
