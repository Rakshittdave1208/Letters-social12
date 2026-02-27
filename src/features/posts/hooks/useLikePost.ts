import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePostAPI } from "../api/posts.api";
import type { Post } from "../types";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePostAPI,

    // ⭐ optimistic update
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previous =
        queryClient.getQueryData<any>(["posts"]);

      queryClient.setQueryData<any>(["posts"], (old: { pages: Post[][]; }) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: Post[]) =>
            page.map((p) =>
              p.id === postId
                ? { ...p, likes: p.likes + 1 }
                : p
            )
          ),
        };
      });

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["posts"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}