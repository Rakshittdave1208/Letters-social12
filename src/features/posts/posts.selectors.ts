import type {Post} from "./types";

export const selectMyPosts=(posts:Post[])=>
  posts.filter((post)=>post.author==="You")
export const selectPopularPosts = (posts: Post[]) =>
  posts.filter((post) => post.likes > 5);