import type { Post } from "./types";

export const selectPostById = (
  posts: Post[],
  id?: string
) => {
  return posts.find((post) => post.id === id);
};