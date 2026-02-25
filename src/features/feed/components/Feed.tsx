import { useEffect } from "react";
import { usePostsStore } from "../../posts/posts.store";
import PostCard from "../../posts/components/PostCard";
import CreatePost from "../../posts/components/CreatePost";

import LoadingState from "../../../components/common/LoadingState";
import EmptyState from "../../../components/common/EmptyState";
import ErrorState from "../../../components/common/ErrorState";

export default function Feed() {
  const { posts, loading, error, fetchPosts, addPost } =
    usePostsStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!posts.length) return <EmptyState />;

  return (
    <div className="space-y-4">
      <CreatePost onCreate={addPost} />

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}