import { create } from "zustand";

type PostsUIState = {
  currentUserId: string | null;

  // Example UI states
  selectedPostId: string | null;
  isCreateModalOpen: boolean;

  // Actions
  setCurrentUser: (id: string | null) => void;
  selectPost: (id: string | null) => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
};

export const usePostsStore = create<PostsUIState>((set) => ({
  currentUserId: "user-1",

  selectedPostId: null,
  isCreateModalOpen: false,

  setCurrentUser: (id) =>
    set({ currentUserId: id }),

  selectPost: (id) =>
    set({ selectedPostId: id }),

  openCreateModal: () =>
    set({ isCreateModalOpen: true }),

  closeCreateModal: () =>
    set({ isCreateModalOpen: false }),
}));