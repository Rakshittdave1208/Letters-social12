// src/features/posts/hooks/useCreatePost.ts
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useAuthStore } from "../../auth/auth.store";
import { createPostAPI } from "../api/posts.api";
import type { Post } from "../types";

export function useCreatePost() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (content: string) => {
      if (!user) throw new Error("Not authenticated");
      return createPostAPI(content, user.id, user.name);
    },

    // Optimistic update — UI feels instant
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
