import { create } from "zustand";
import type { Post } from "./types";
import { fetchPostsAPI } from "./posts.api";

type PostsState = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (content: string) => void;
  likePost: (id: string) => void;
  addComment: (postId: string, content: string) => void; // ✅ Added
};

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    try {
      set({ loading: true, error: null });

      const posts = await fetchPostsAPI();

      set({ posts, loading: false });
    } catch {
      set({
        loading: false,
        error: "Failed to load posts",
      });
    }
  },

  addPost: (content) =>
    set((state) => ({
      posts: [
        {
          id: Date.now().toString(),
          author: "You",
          content,
          createdAt: "Just now",
          likes: 0,
          comments: [],
        },
        ...state.posts,
      ],
    })),

  likePost: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? { ...post, likes: post.likes + 1 }
          : post
      ),
    })),

  // ✅ ADD COMMENT IMPLEMENTATION
  addComment: (postId, content) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now().toString(),
                  author: "You",
                  content,
                  createdAt: "Just now",
                },
              ],
            }
          : post
      ),
    })),
}));