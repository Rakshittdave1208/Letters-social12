// src/features/search/SearchPage.tsx
import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import PostCard from "../posts/components/PostCard";
import { PostCardSkeleton, UserCardSkeleton } from "../../components/ui/Skeleton";
import type { Post } from "../posts/types";

type UserResult = { id: string; name: string; photoURL: string | null };

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
  const colors = ["from-blue-500 to-indigo-600","from-purple-500 to-pink-600","from-green-500 to-teal-600","from-orange-500 to-red-600"];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts]           = useState<Post[]>([]);
  const [users, setUsers]           = useState<UserResult[]>([]);
  const [loading, setLoading]       = useState(false);
  const [searched, setSearched]     = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setPosts([]); setUsers([]); setSearched(false); return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(searchTerm.trim()), 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  async function handleSearch(term: string) {
    setLoading(true);
    try {
      const postsSnap = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20)));
      const allPosts = postsSnap.docs.map((d) => ({
        id: d.id, ...(d.data() as any),
        createdAt: formatTimestamp(d.data().createdAt),
        likedBy: d.data().likedBy ?? [], comments: d.data().comments ?? [],
      })) as Post[];
      setPosts(allPosts.filter((p) =>
        p.content.toLowerCase().includes(term.toLowerCase()) ||
        p.author.toLowerCase().includes(term.toLowerCase())
      ));

      const usersSnap = await getDocs(query(collection(db, "users"), orderBy("name"), limit(10)));
      const allUsers = usersSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as UserResult[];
      setUsers(allUsers.filter((u) => u.name?.toLowerCase().includes(term.toLowerCase())));
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const hasResults = posts.length > 0 || users.length > 0;

  return (
    <div className="space-y-4">

      {/* Search bar */}
      <div className={`bg-white dark:bg-gray-900 border rounded-2xl px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
        searchTerm ? "border-blue-300 dark:border-blue-700 shadow-md" : "border-gray-100 dark:border-gray-800"
      }`}>
        <span className="text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts or people..."
          autoFocus
          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs transition">
            ✕
          </button>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          <UserCardSkeleton />
          <UserCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      )}

      {/* People results */}
      {!loading && users.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">People</h2>
          {users.map((u) => {
            const initials = u.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
            return (
              <div key={u.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3 hover:border-gray-200 dark:hover:border-gray-700 transition">
                {u.photoURL ? (
                  <img src={u.photoURL} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(u.name ?? "A")} text-white flex items-center justify-center text-sm font-bold`}>
                    {initials}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{u.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post results */}
      {!loading && posts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">Posts</h2>
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {/* No results */}
      {!loading && searched && !hasResults && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300">No results for "{searchTerm}"</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}

      {/* Initial empty state */}
      {!searched && !loading && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
          <p className="text-5xl mb-4">✉️</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300">Find posts and people</p>
          <p className="text-sm text-gray-400 mt-1">Search for posts or people</p>
        </div>
      )}
    </div>
  );
}