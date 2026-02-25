import { useEffect } from "react";
import { usePosts } from "../../posts/hooks/usePosts";
import PostCard from "../../posts/components/PostCard";
import CreatePost from "../../posts/components/CreatePost";

import LoadingState from "../../../components/common/LoadingState";
import EmptyState from "../../../components/common/EmptyState";
import ErrorState from "../../../components/common/ErrorState";

export default function Feed() {
  const { posts, loading, error, fetchPosts, addPost } =
    usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-4">
      <CreatePost onCreate={addPost} />

      {!posts.length ? (
        <EmptyState />
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
}