import type { Post } from "../types";
import { mockPosts } from "../data/mockPosts";

const PAGE_SIZE = 5;

/* ---------- GET POSTS ---------- */
export async function getPosts(page: number): Promise<Post[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      resolve(mockPosts.slice(start, end));
    }, 600);
  });
}

/* ---------- LIKE POST ---------- */
export async function likePostAPI(id: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Liked:", id);
      resolve();
    }, 400);
  });
}