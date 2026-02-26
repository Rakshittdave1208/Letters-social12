import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePostAPI } from "../../../services/posts.service";
import type { Post } from "../types";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePostAPI,

    // ⭐ OPTIMISTIC UPDATE
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts =
        queryClient.getQueryData<Post[]>(["posts"]);

      queryClient.setQueryData<Post[]>(
        ["posts"],
        (oldPosts = []) =>
          oldPosts.map((post) =>
            post.id === postId
              ? { ...post, likes: post.likes + 1 }
              : post
          )
      );

      return { previousPosts };
    },

    // ⭐ rollback if error
    onError: (_err, _postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          ["posts"],
          context.previousPosts
        );
      }
    },

    // ⭐ ensure sync with server
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}