import type { Comment } from "../comments/types";

export interface Post {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}