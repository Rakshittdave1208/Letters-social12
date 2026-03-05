// src/features/posts/api/posts.api.ts
// ─────────────────────────────────────────────────────────
// Replaces mock data with real Firestore.
// Hook files (useInfinitePosts, useLikePost) need NO changes
// except useCreatePost which needs the real user.
// ─────────────────────────────────────────────────────────

import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type { Post } from "../types";

const PAGE_SIZE = 5;

// Cache last doc per page for cursor-based pagination
const cursorCache = new Map<number, DocumentSnapshot>();

// ── Helpers ───────────────────────────────────────────────

function formatTimestamp(ts: any): string {
  if (!ts) return "Just now";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

function docToPost(d: any): Post {
  const data = d.data();
  return {
    id:        d.id,
    userId:    data.userId    ?? "",
    author:    data.author    ?? "Unknown",
    content:   data.content   ?? "",
    createdAt: formatTimestamp(data.createdAt),
    likes:     data.likes     ?? 0,
    likedBy:   data.likedBy   ?? [],
    comments:  data.comments  ?? [],
  };
}

// ── GET POSTS (cursor paginated) ──────────────────────────
export async function getPosts(page: number): Promise<Post[]> {
  const postsRef = collection(db, "posts");

  let q;
  if (page === 0) {
    q = query(postsRef, orderBy("createdAt", "desc"), limit(PAGE_SIZE));
  } else {
    const cursor = cursorCache.get(page - 1);
    if (!cursor) return [];
    q = query(postsRef, orderBy("createdAt", "desc"), startAfter(cursor), limit(PAGE_SIZE));
  }

  const snap = await getDocs(q);
  if (snap.empty) return [];

  // Save last doc as cursor for next page
  cursorCache.set(page, snap.docs[snap.docs.length - 1]);

  return snap.docs.map(docToPost);
}

// ── CREATE POST ───────────────────────────────────────────
export async function createPostAPI(
  content: string,
  userId: string,
  author: string
): Promise<Post> {
  const ref = await addDoc(collection(db, "posts"), {
    userId,
    author,
    content,
    likes:     0,
    likedBy:   [],
    comments:  [],
    createdAt: serverTimestamp(),
  });

  return {
    id:        ref.id,
    userId,
    author,
    content,
    createdAt: "Just now",
    likes:     0,
    likedBy:   [],
    comments:  [],
  };
}

// ── LIKE / UNLIKE POST (atomic, prevents double-like) ─────
export async function likePostAPI(
  postId: string,
  userId: string,
  hasLiked: boolean
): Promise<void> {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, {
    likes:   increment(hasLiked ? -1 : 1),
    likedBy: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
  });
}
