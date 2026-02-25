import type {Post} from "./types";
import { mockPosts } from './data/mockPosts';
export async function fetchPostsAPI(): Promise<Post[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockPosts), 800)
  );
}