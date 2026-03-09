

import { create } from "zustand";

type PostsUIState = {
  posts: any;
  loading: any;
  error: any;
  addComment: any;
  fetchPosts: any;
  likePost: any;
  addPost: any;
  currentUserId: string | null;

  selectedPostId:    string | null;
  isCreateModalOpen: boolean;

  // Actions
  setCurrentUser:  (id: string | null) => void;
  selectPost:      (id: string | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
};

export const usePostsStore = create<PostsUIState>((set) => ({
  // ✅ No longer hardcoded — synced from auth
  posts: [],
  loading: false,
  error: null,
  addComment: () => {},
  fetchPosts: () => {},
  likePost: () => {},
  addPost: () => {},
  currentUserId: null,

  selectedPostId:    null,
  isCreateModalOpen: false,

  setCurrentUser:   (id) => set({ currentUserId: id }),
  selectPost:       (id) => set({ selectedPostId: id }),
  openCreateModal:  ()  => set({ isCreateModalOpen: true }),
  closeCreateModal: ()  => set({ isCreateModalOpen: false }),
}));