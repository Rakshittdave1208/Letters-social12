// src/features/bookmarks/BookmarksPage.tsx
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthStore } from "../auth/auth.store";
import PostCard from "../posts/components/PostCard";
import type { Post } from "../posts/types";

function formatTimestamp(ts: any): string {
  if (!ts) return "Just now";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function BookmarksPage() {
  const user = useAuthStore((s) => s.user);
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to bookmarked post IDs
    const q = query(
      collection(db, "bookmarks", user.id, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const postIds = snap.docs.map((d) => d.id);

      // Fetch actual post data for each bookmark
      const fetched = await Promise.all(
        postIds.map(async (id) => {
          const postDoc = await getDoc(doc(db, "posts", id));
          if (!postDoc.exists()) return null;
          const data = postDoc.data();
          return {
            id:        postDoc.id,
            userId:    data.userId    ?? "",
            author:    data.author    ?? "",
            content:   data.content   ?? "",
            createdAt: formatTimestamp(data.createdAt),
            likes:     data.likes     ?? 0,
            likedBy:   data.likedBy   ?? [],
            comments:  data.comments  ?? [],
          } as Post;
        })
      );

      setPosts(fetched.filter(Boolean) as Post[]);
      setLoading(false);
    });

    return unsub;
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-3">🔖</p>
          <p className="font-medium">No bookmarks yet</p>
          <p className="text-sm">Tap 🔖 on any post to save it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}