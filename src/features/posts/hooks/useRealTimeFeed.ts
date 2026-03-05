
import { useState, useEffect, useCallback } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, onSnapshot, type DocumentSnapshot, type Unsubscribe } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type { Post } from "../types";

const PAGE_SIZE = 10;

function formatTimestamp(ts: any): string {
  if (!ts) return "Just now";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

function docToPost(d: DocumentSnapshot): Post {
  const data = d.data() as any;
  return {
    id: d.id,
    userId: data.userId ?? "",
    author: data.author ?? "Unknown",
    content: data.content ?? "",
    createdAt: formatTimestamp(data.createdAt),
    likes: data.likes ?? 0,
    likedBy: data.likedBy ?? [],
    comments: data.comments ?? [],
  };
}

export function useRealtimeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    const unsub: Unsubscribe = onSnapshot(q,
      (snapshot) => {
        setPosts(snapshot.docs.map(docToPost));
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
        setHasMore(snapshot.docs.length === PAGE_SIZE);
        setIsLoading(false);
      },
      (err) => { setError(err); setIsLoading(false); }
    );
    return () => unsub();
  }, []);

  const loadMore = useCallback(async () => {
    if (!lastDoc || isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(PAGE_SIZE));
      const snap = await getDocs(q);
      const morePosts = snap.docs.map(docToPost);
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...morePosts.filter((p) => !ids.has(p.id))];
      });
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) { setError(err as Error); }
    finally { setIsFetchingMore(false); }
  }, [lastDoc, isFetchingMore, hasMore]);

  return { posts, isLoading, error, hasMore, isFetchingMore, loadMore };
}
