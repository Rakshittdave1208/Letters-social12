// src/features/bookmarks/bookmarks.api.ts
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { Post } from "../posts/types";

// ── Save a bookmark ───────────────────────────────────────
export async function bookmarkPost(userId: string, post: Post): Promise<void> {
  const ref = doc(db, "bookmarks", userId, "posts", post.id);
  await setDoc(ref, {
    postId:    post.id,
    userId:    post.userId,
    author:    post.author,
    content:   post.content,
    createdAt: serverTimestamp(),
  });
}

// ── Remove a bookmark ─────────────────────────────────────
export async function unbookmarkPost(userId: string, postId: string): Promise<void> {
  const ref = doc(db, "bookmarks", userId, "posts", postId);
  await deleteDoc(ref);
}

// ── Listen to user's bookmarks in real-time ───────────────
export function subscribeBookmarks(
  userId: string,
  callback: (postIds: string[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "bookmarks", userId, "posts"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.id));
  });
}
