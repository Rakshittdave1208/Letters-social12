// src/features/messages/hooks/useMessages.ts
import { useState, useEffect } from "react";
import {
  collection, doc, addDoc, updateDoc, onSnapshot,
  query, where, serverTimestamp, getDoc, setDoc
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuthStore } from "../../auth/auth.store";
import type { Conversation, Message } from "../types";

export function getConversationId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join("_");
}

export async function startConversation(
  currentUser: { id: string; name: string; photoURL: string | null },
  otherUser:   { id: string; name: string; photoURL: string | null }
): Promise<string> {
  const convId  = getConversationId(currentUser.id, otherUser.id);
  const convRef = doc(db, "conversations", convId);
  const snap    = await getDoc(convRef);

  if (!snap.exists()) {
    await setDoc(convRef, {
      participants: [currentUser.id, otherUser.id],
      participantNames: {
        [currentUser.id]: currentUser.name,
        [otherUser.id]:   otherUser.name,
      },
      participantPhotos: {
        [currentUser.id]: currentUser.photoURL,
        [otherUser.id]:   otherUser.photoURL,
      },
      lastMessage:   "",
      lastMessageAt: serverTimestamp(),
      unreadCount: {
        [currentUser.id]: 0,
        [otherUser.id]:   0,
      },
    });
  }
  return convId;
}

export function useConversations() {
  const user = useAuthStore((s) => s.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    // No orderBy here — avoids needing a composite Firestore index
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.id)
    );

    const unsub = onSnapshot(q, (snap) => {
      const convs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Conversation));
      // Sort client-side by most recent message
      convs.sort((a: any, b: any) =>
        (b.lastMessageAt?.seconds ?? 0) - (a.lastMessageAt?.seconds ?? 0)
      );
      setConversations(convs);
      setLoading(false);
    }, (err) => {
      console.error("Conversations error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return { conversations, loading };
}

export function useChat(conversationId: string) {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!conversationId) return;

    // Simple query with no composite index needed
    const q = query(
      collection(db, "conversations", conversationId, "messages")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
      // Sort client-side by createdAt
      msgs.sort((a: any, b: any) =>
        (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)
      );
      setMessages(msgs);
      setLoading(false);
    }, (err) => {
      console.error("Messages error:", err);
      setLoading(false);
    });

    // Mark as read
    if (user) {
      updateDoc(doc(db, "conversations", conversationId), {
        [`unreadCount.${user.id}`]: 0,
      }).catch(() => {});
    }

    return () => unsub();
  }, [conversationId, user]);

  async function sendMessage(text: string) {
    if (!user || !text.trim()) return;

    const convSnap = await getDoc(doc(db, "conversations", conversationId));
    const conv     = convSnap.data() as Conversation;
    const otherId  = conv.participants.find((p) => p !== user.id) ?? "";

    await addDoc(collection(db, "conversations", conversationId, "messages"), {
      senderId:   user.id,
      senderName: user.name,
      text:       text.trim(),
      createdAt:  serverTimestamp(),
      read:       false,
    });

    await updateDoc(doc(db, "conversations", conversationId), {
      lastMessage:   text.trim(),
      lastMessageAt: serverTimestamp(),
      [`unreadCount.${otherId}`]: (conv.unreadCount?.[otherId] ?? 0) + 1,
    });
  }

  return { messages, loading, sendMessage };
}