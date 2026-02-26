import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../../services/posts.service";

export function usePostQuery(postId: string | undefined) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId, // prevents running if undefined
  });
}