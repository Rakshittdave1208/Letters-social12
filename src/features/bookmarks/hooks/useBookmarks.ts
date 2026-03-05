// src/features/bookmarks/hooks/useBookmarks.ts
import { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/auth.store"
import { bookmarkPost, unbookmarkPost, subscribeBookmarks } from "../bookmarks.api"
import { useToast } from "../../../components/ui/Toast";
import type { Post } from "../../posts/types";

export function useBookmarks() {
  const user             = useAuthStore((s) => s.user);
  const { toast }        = useToast();
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Real-time listener
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeBookmarks(user.id, setBookmarkedIds);
    return unsub;
  }, [user]);

  const isBookmarked = (postId: string) => bookmarkedIds.includes(postId);

  const toggleBookmark = async (post: Post) => {
    if (!user) return;
    try {
      if (isBookmarked(post.id)) {
        await unbookmarkPost(user.id, post.id);
        toast.info("Bookmark removed");
      } else {
        await bookmarkPost(user.id, post);
        toast.success("Post bookmarked! 🔖");
      }
    } catch {
      toast.error("Failed to update bookmark.");
    }
  };

  return { bookmarkedIds, isBookmarked, toggleBookmark };
}