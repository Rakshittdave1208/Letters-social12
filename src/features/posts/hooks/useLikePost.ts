// src/features/posts/hooks/useLikePost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePostAPI } from "../api/posts.api";
import { useAuthStore } from "../../auth/auth.store";
import type { Post } from "../types";

export function useLikePost() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: ({ postId, hasLiked }: { postId: string; hasLiked: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      return likePostAPI(postId, user.id, hasLiked);
    },

    // ── Optimistic update ─────────────────────────────
    onMutate: async ({ postId, hasLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previous = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData<any>(["posts"], (old: { pages: Post[][] }) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: Post[]) =>
            page.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    likes:   p.likes + (hasLiked ? -1 : 1),
                    likedBy: hasLiked
                      ? p.likedBy.filter((id) => id !== user?.id)
                      : [...p.likedBy, user?.id ?? ""],
                  }
                : p
            )
          ),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["posts"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
