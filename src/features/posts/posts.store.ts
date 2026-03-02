// features/posts/posts.store.ts
// ─────────────────────────────────────────────────────────
// Same shape as before — only change:
// currentUserId now defaults to null (auth store owns it).
// Call syncUser() from App once auth state resolves.
// ─────────────────────────────────────────────────────────

import { create } from "zustand";

type PostsUIState = {
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
  currentUserId: null,

  selectedPostId:    null,
  isCreateModalOpen: false,

  setCurrentUser:   (id) => set({ currentUserId: id }),
  selectPost:       (id) => set({ selectedPostId: id }),
  openCreateModal:  ()  => set({ isCreateModalOpen: true }),
  closeCreateModal: ()  => set({ isCreateModalOpen: false }),
}));