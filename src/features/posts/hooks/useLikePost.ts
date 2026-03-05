// src/features/posts/hooks/useLikePost.ts
import { useMutation } from "@tanstack/react-query";
import { likePostAPI } from "../api/posts.api";
import { useAuthStore } from "../../auth/auth.store";

export function useLikePost() {
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: ({ postId, hasLiked }: { postId: string; hasLiked: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      return likePostAPI(postId, user.id, hasLiked);
    },
    // No optimistic update needed — onSnapshot handles live UI updates
  });
}