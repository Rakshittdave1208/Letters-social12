import { useEffect } from "react";
import { usePosts } from "../../posts/hooks/usePosts";

export function useFeed() {
  const { posts, loading, error, fetchPosts } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
  };
}