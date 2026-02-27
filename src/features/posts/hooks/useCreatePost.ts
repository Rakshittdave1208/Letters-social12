import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import type { Post } from "../types";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      await new Promise((r) => setTimeout(r, 400));

      return {
        id: Date.now().toString(),
        userId: "user-1",
        author: "You",
        content,
        createdAt: "Just now",
        likes: 0,
        comments: [],
      };
    },

    onSuccess: (newPost) => {
      queryClient.setQueryData<InfiniteData<Post[]>>(
        ["posts"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: [
              [newPost, ...old.pages[0]],
              ...old.pages.slice(1),
            ],
          };
        }
      );
    },
  });
}