import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts.api";
import type { Post } from "../types";

export function useInfinitePosts() {
  return useInfiniteQuery<Post[]>({
    queryKey: ["posts"],

    queryFn: ({ pageParam }) =>
      getPosts(pageParam as number),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length;
    },
  });
}