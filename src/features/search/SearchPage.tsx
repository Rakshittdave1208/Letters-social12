// src/features/search/SearchPage.tsx
import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import Card from "../../components/ui/Card";
import PostCard from "../posts/components/PostCard";
import type { Post } from "../posts/types";

type UserResult = {
  id:       string;
  name:     string;
  photoURL: string | null;
};

function formatTimestamp(ts: any): string {
  if (!ts) return "Just now";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
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
      setPosts([]);
      setUsers([]);
      setSearched(false);
      return;
    }

    // Debounce search by 400ms
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(searchTerm.trim());
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  async function handleSearch(term: string) {
    setLoading(true);
    try {
      // Search posts by content (prefix match on author)
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      const postsSnap = await getDocs(postsQuery);
      const allPosts = postsSnap.docs.map((d) => ({
        id:        d.id,
        ...(d.data() as any),
        createdAt: formatTimestamp(d.data().createdAt),
        likedBy:   d.data().likedBy ?? [],
        comments:  d.data().comments ?? [],
      })) as Post[];

      // Client-side filter (Firestore doesn't support full-text search natively)
      const filtered = allPosts.filter(
        (p) =>
          p.content.toLowerCase().includes(term.toLowerCase()) ||
          p.author.toLowerCase().includes(term.toLowerCase())
      );
      setPosts(filtered);

      // Search users collection
      const usersQuery = query(
        collection(db, "users"),
        orderBy("name"),
        limit(10)
      );
      const usersSnap = await getDocs(usersQuery);
      const allUsers = usersSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as UserResult[];

      const filteredUsers = allUsers.filter((u) =>
        u.name?.toLowerCase().includes(term.toLowerCase())
      );
      setUsers(filteredUsers);

      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <Card>
        <div className="flex items-center gap-3">
          <span className="text-xl">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts or people..."
            autoFocus
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"
            >
              ✕
            </button>
          )}
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Users */}
      {!loading && users.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">
            People
          </h2>
          {users.map((u) => {
            const initials = u.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
            return (
              <Card key={u.id}>
                <div className="flex items-center gap-3">
                  {u.photoURL ? (
                    <img src={u.photoURL} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Posts */}
      {!loading && posts.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">
            Posts
          </h2>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && searched && posts.length === 0 && users.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No results for "{searchTerm}"</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      {/* Initial state */}
      {!searched && !loading && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-3">✉️</p>
          <p className="text-sm">Search for posts or people</p>
        </div>
      )}
    </div>
  );
}
