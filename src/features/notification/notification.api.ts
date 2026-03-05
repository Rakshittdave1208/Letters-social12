// src/features/notifications/notifications.api.ts
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
export type NotificationType = "like" | "follow" | "comment";

export type Notification = {
  id:         string;
  type:       NotificationType;
  fromUserId: string;
  fromName:   string;
  message:    string;
  postId?:    string;
  read:       boolean;
  createdAt:  string;
};

type CreateNotificationInput = {
  type:       NotificationType;
  fromUserId: string;
  fromName:   string;
  message:    string;
  postId?:    string;
};

// ── Create a notification ─────────────────────────────────
export async function createNotification(
  targetUserId: string,
  data: CreateNotificationInput
): Promise<void> {
  await addDoc(collection(db, "notifications", targetUserId, "items"), {
    ...data,
    read:      false,
    createdAt: serverTimestamp(),
  });
}

// ── Mark notification as read ─────────────────────────────
export async function markAsRead(
  userId: string,
  notificationId: string
): Promise<void> {
  await updateDoc(
    doc(db, "notifications", userId, "items", notificationId),
    { read: true }
  );
}

// ── Subscribe to notifications in real-time ───────────────
export function subscribeNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "notifications", userId, "items"),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => {
      const data = d.data();
      const ts   = data.createdAt;
      let createdAt = "Just now";
      if (ts?.toDate) {
        const diff = Math.floor((Date.now() - ts.toDate().getTime()) / 1000);
        if (diff < 60)    createdAt = `${diff}s ago`;
        else if (diff < 3600) createdAt = `${Math.floor(diff / 60)}m ago`;
        else createdAt = `${Math.floor(diff / 3600)}h ago`;
      }
      return {
        id:         d.id,
        type:       data.type,
        fromUserId: data.fromUserId,
        fromName:   data.fromName,
        message:    data.message,
        postId:     data.postId,
        read:       data.read ?? false,
        createdAt,
      } as Notification;
    });
    callback(items);
  });
}
