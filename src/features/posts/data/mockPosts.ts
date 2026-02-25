import type { Post } from "../types";

export const mockPosts: Post[] = [
  {
    id: "1",
    userId: "user-2", // ✅ must be string
    author: "Rakshit",
    content: "Hello Letters Social 🚀",
    createdAt: "2 min ago",
    likes: 3,
    comments: [],
  },
  {
    id: "2",
    userId: "user-3", // ✅ must be string
    author: "Alex",
    content: "This feels like Twitter already!",
    createdAt: "10 min ago",
    likes: 7,
    comments: [],
  },
];