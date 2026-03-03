// src/features/posts/types.ts
import type { Comment } from "../comments/types";

export interface Post {
  id:        string;
  userId:    string;
  author:    string;
  content:   string;
  createdAt: string; // always a display string in the UI
  likes:     number;
  likedBy:   string[]; // tracks who liked — prevents double-liking
  comments:  Comment[];
}