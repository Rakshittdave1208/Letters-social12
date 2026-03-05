// src/features/follow/follow.api.ts
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  query,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

// ── Follow a user ─────────────────────────────────────────
export async function followUser(
  followerId: string,
  followerName: string,
  targetId: string,
  targetName: string
): Promise<void> {
  // Add to follower's following list
  await setDoc(doc(db, "follows", followerId, "following", targetId), {
    userId:    targetId,
    name:      targetName,
    createdAt: serverTimestamp(),
  });
  // Add to target's followers list
  await setDoc(doc(db, "follows", targetId, "followers", followerId), {
    userId:    followerId,
    name:      followerName,
    createdAt: serverTimestamp(),
  });
}

// ── Unfollow a user ───────────────────────────────────────
export async function unfollowUser(
  followerId: string,
  targetId: string
): Promise<void> {
  await deleteDoc(doc(db, "follows", followerId, "following", targetId));
  await deleteDoc(doc(db, "follows", targetId, "followers", followerId));
}

// ── Check if following ────────────────────────────────────
export async function isFollowing(
  followerId: string,
  targetId: string
): Promise<boolean> {
  const ref = doc(db, "follows", followerId, "following", targetId);
  const snap = await getDoc(ref);
  return snap.exists();
}

// ── Subscribe to follower/following counts ────────────────
export function subscribeFollowCounts(
  userId: string,
  callback: (counts: { followers: number; following: number }) => void
): Unsubscribe {
  let followers = 0;
  let following = 0;

  const unsubFollowers = onSnapshot(
    collection(db, "follows", userId, "followers"),
    (snap) => { followers = snap.size; callback({ followers, following }); }
  );
  const unsubFollowing = onSnapshot(
    collection(db, "follows", userId, "following"),
    (snap) => { following = snap.size; callback({ followers, following }); }
  );

  return () => { unsubFollowers(); unsubFollowing(); };
}

// ── Subscribe to following list (ids) ─────────────────────
export function subscribeFollowing(
  userId: string,
  callback: (ids: string[]) => void
): Unsubscribe {
  const q = query(collection(db, "follows", userId, "following"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.id));
  });
}
