import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../../../services/posts.service";
import type { Post } from "../types";

export function useInfinitePosts() {
  return useInfiniteQuery<Post[]>({
    queryKey: ["posts"],

    queryFn: ({ pageParam }) =>
      getPosts(pageParam as number), // ⭐ fix

    initialPageParam: 0, // ⭐ REQUIRED in v5

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length;
    },
  });
}