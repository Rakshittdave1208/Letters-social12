// src/features/analytics/AnalyticsPage.tsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
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

type PostWithStats = Post & { engagementRate: number };

export default function AnalyticsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate                  = useNavigate();
  const [posts, setPosts]         = useState<PostWithStats[]>([]);
  const [loading, setLoading]     = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    if (!user) return;
    async function fetchPosts() {
      try {
        const q = query(collection(db, "posts"), where("userId", "==", user!.id));
        const snap = await getDocs(q);
        const myPosts = snap.docs.map((d) => {
          const data = d.data();
          const likes    = data.likes ?? 0;
          const comments = (data.comments ?? []).length;
          const engagement = likes + comments;
          return {
            id:              d.id,
            userId:          data.userId    ?? "",
            author:          data.author    ?? "",
            content:         data.content   ?? "",
            createdAt:       formatTimestamp(data.createdAt),
            likes,
            likedBy:         data.likedBy   ?? [],
            comments:        data.comments  ?? [],
            engagementRate:  engagement,
          } as PostWithStats;
        });
        // Sort by engagement
        myPosts.sort((a, b) => b.engagementRate - a.engagementRate);
        setPosts(myPosts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [user]);

  const totalLikes    = posts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);
  const totalPosts    = posts.length;
  const avgLikes      = totalPosts ? (totalLikes / totalPosts).toFixed(1) : "0";
  const topPost       = posts[0];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Your Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Only you can see this page
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Posts",    value: totalPosts,    icon: "✉️",  color: "from-blue-500 to-indigo-600"  },
          { label: "Total Likes",    value: totalLikes,    icon: "❤️",  color: "from-red-500 to-pink-600"     },
          { label: "Total Comments", value: totalComments, icon: "💬",  color: "from-green-500 to-teal-600"   },
          { label: "Avg Likes/Post", value: avgLikes,      icon: "📈",  color: "from-purple-500 to-violet-600"},
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
            <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${color} flex items-center justify-center text-lg mb-3`}>
              {icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Top post */}
      {topPost && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            🏆 Top performing post
          </h2>
          <p className="text-gray-900 dark:text-white text-sm leading-relaxed mb-3 line-clamp-3">
            "{topPost.content}"
          </p>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1 text-red-500 font-medium">❤️ {topPost.likes}</span>
            <span className="flex items-center gap-1 text-blue-500 font-medium">💬 {topPost.comments.length}</span>
            <span className="text-gray-400 ml-auto">{topPost.createdAt}</span>
          </div>
        </div>
      )}

      {/* All posts table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">All Posts Performance</h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">✉️</p>
            <p className="text-sm">No posts yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {posts.map((post, i) => (
              <div key={post.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                {/* Rank */}
                <span className="text-lg font-bold text-gray-300 dark:text-gray-600 w-6 shrink-0">
                  {i + 1}
                </span>

                {/* Content */}
                <p className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                  {post.content}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className="flex items-center gap-1 text-red-500 font-medium">
                    ❤️ {post.likes}
                  </span>
                  <span className="flex items-center gap-1 text-blue-500 font-medium">
                    💬 {post.comments.length}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    post.engagementRate >= 5
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                      : post.engagementRate >= 2
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                  }`}>
                    {post.engagementRate >= 5 ? "🔥 Hot" : post.engagementRate >= 2 ? "📈 Good" : "💤 Low"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Engagement tip */}
      <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-white">
        <h3 className="font-bold mb-1">💡 Tip to grow engagement</h3>
        <p className="text-sm opacity-90 leading-relaxed">
          Posts with questions get 3x more comments. Try ending your next post with a question to spark conversation!
        </p>
      </div>

    </div>
  );
}