// src/features/posts/hooks/useDeletePost.ts
import { useMutation } from "@tanstack/react-query";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuthStore } from "../../auth/auth.store";

// ── Delete entire post ────────────────────────────────────
export function useDeletePost() {
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({ postId, authorId }: { postId: string; authorId: string }) => {
      if (!user) throw new Error("Not authenticated");
      if (user.id !== authorId) throw new Error("Not authorized");
      await deleteDoc(doc(db, "posts", postId));
    },
  });
}

// ── Delete a single comment from a post ──────────────────
export function useDeleteComment() {
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({
      postId,
      comments,
      commentId,
      commentAuthorId,
    }: {
      postId:          string;
      comments:        any[];
      commentId:       string;
      commentAuthorId: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      if (user.id !== commentAuthorId) throw new Error("Not authorized");
      const updated = comments.filter((c) => c.id !== commentId);
      await updateDoc(doc(db, "posts", postId), { comments: updated });
    },
  });
}