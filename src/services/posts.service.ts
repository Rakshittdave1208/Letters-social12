import type { Post } from "../features/posts/types";
import type { Comment } from "../features/comments/types";
import { mockPosts } from "../features/posts/data/mockPosts";

/* ======================================================
   CONFIG
====================================================== */

const PAGE_SIZE = 5;

/* ======================================================
   GET POSTS (Paginated Query)
====================================================== */

export async function getPosts(
  page: number
): Promise<Post[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      resolve(mockPosts.slice(start, end));
    }, 600); // simulate network delay
  });
}

/* ======================================================
   LIKE POST (Mutation)
====================================================== */

export async function likePostAPI(
  postId: string
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Liked post:", postId);
      resolve();
    }, 400);
  });
}

/* ======================================================
   CREATE POST (Mutation)
====================================================== */

export async function createPostAPI(
  post: Post
): Promise<Post> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Created post:", post);
      resolve(post);
    }, 500);
  });
}

/* ======================================================
   ADD COMMENT (Mutation)
====================================================== */

export async function addCommentAPI(
  postId: string,
  comment: Comment
): Promise<Comment> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Added comment to:", postId);
      resolve(comment);
    }, 400);
  });
}
export async function getPostById(
  postId: string
): Promise<Post | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPosts.find((p) => p.id === postId);
      resolve(post);
    }, 500);
  });
}