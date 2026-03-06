// src/features/profile/ProfilePage.tsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../auth/hooks/useAuth";
import PostCard from "../posts/components/PostCard";
import type { Post } from "../posts/types";
import { PostCardSkeleton, ProfileSkeleton } from "../../components/ui/Skeleton";

function formatTimestamp(ts: any): string {
  if (!ts) return "Just now";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

function getAvatarColor(name: string) {
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-rose-500 to-pink-600",
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function ProfilePage() {
  const { user }              = useAuth();
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    async function fetchMyPosts() {
      try {
        const q = query(collection(db, "posts"), where("userId", "==", user!.id));
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyPosts();
  }, [user]);

  const initials      = user?.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
  const joinDate      = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const totalLikes    = posts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = posts.reduce((acc, p) => acc + (p.comments?.length ?? 0), 0);

  if (!user && !loading) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
        <p className="text-5xl mb-4">🔐</p>
        <p className="font-semibold text-gray-700 dark:text-gray-300">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {loading ? <ProfileSkeleton /> : (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-900" />
              ) : (
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarColor(user?.name ?? "A")} text-white flex items-center justify-center text-2xl font-bold ring-4 ring-white dark:ring-gray-900`}>
                  {initials}
                </div>
              )}
              <button className="px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                Edit profile
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">📅 Joined {joinDate}</p>
            <div className="flex gap-8 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              {[
                { label: "Posts",    value: posts.length },
                { label: "Likes",    value: totalLikes },
                { label: "Comments", value: totalComments },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 mb-3">Posts</h2>
        {loading ? (
          <div className="space-y-4"><PostCardSkeleton /><PostCardSkeleton /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
            <p className="text-5xl mb-4">✉️</p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">No posts yet</p>
            <p className="text-sm text-gray-400 mt-1">Share something on the home feed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}
