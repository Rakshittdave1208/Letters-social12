import { create } from "zustand";
import type { Post } from "./types";
import { fetchPostsAPI } from "./posts.api";

type PostsState = {
  currentUserId: string | null;
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean; // ✅ Added
  fetchPosts: () => Promise<void>;
  addPost: (content: string) => void;
  likePost: (id: string) => void;
  addComment: (postId: string, content: string) => void;
};

export const usePostsStore = create<PostsState>((set, get) => ({
  currentUserId: "user-1",
  posts: [],
  loading: false,
  error: null,
  hasLoaded: false, // ✅ Initialized

  fetchPosts: async (force = false) => {
  set((state) => {
    if (state.hasLoaded && !force) return state;
    return { loading: true, error: null };
  });

  try {
    const posts = await fetchPostsAPI();

    set({
      posts,
      loading: false,
      hasLoaded: true,
    });
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
          userId: state.currentUserId ?? "user-1",
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