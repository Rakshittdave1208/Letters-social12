import { usePostsStore } from "../posts.store";

export function usePosts() {
  const posts = usePostsStore((s) => s.posts);
  const loading = usePostsStore((s) => s.loading);
  const error = usePostsStore((s) => s.error);

  const fetchPosts = usePostsStore((s) => s.fetchPosts);
  const likePost = usePostsStore((s) => s.likePost);
  const addPost = usePostsStore((s) => s.addPost);
  const addComment = usePostsStore((s) => s.addComment);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    likePost,
    addPost,
    addComment,
  };
}