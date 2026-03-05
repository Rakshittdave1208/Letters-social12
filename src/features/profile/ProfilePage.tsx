// src/features/profile/ProfilePage.tsx
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../auth/hooks/useAuth";
import { useToast } from "../../components/ui/Toast";
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

export default function ProfilePage() {
  const { user }              = useAuth();
  const { toast }             = useToast();
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchMyPosts() {
      try {
        const q = query(
          collection(db, "posts"),
          where("userId", "==", user!.id)
        
        );
        const snap = await getDocs(q);
        const myPosts = snap.docs.map((d) => {
          const data = d.data();
          return {
            id:        d.id,
            userId:    data.userId    ?? "",
            author:    data.author    ?? "",
            content:   data.content   ?? "",
            createdAt: formatTimestamp(data.createdAt),
            likes:     data.likes     ?? 0,
            likedBy:   data.likedBy   ?? [],
            comments:  data.comments  ?? [],
          } as Post;
        });
        setPosts(myPosts);
      } catch (err) {
        toast.error("Failed to load your posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyPosts();
  }, [user]);

  // ── Avatar initials ────────────────────────────────────
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <div className="space-y-6">

      {/* Profile header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {user?.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-3">✉️</p>
          <p className="font-medium">No posts yet</p>
          <p className="text-sm">Share something on the home feed!</p>
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