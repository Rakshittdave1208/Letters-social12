// src/hooks/useTyping.ts
import { useEffect, useRef } from "react";
import { ref, set, onValue, remove } from "firebase/database";
import { rtdb } from "../lib/firebase";
import { useAuthStore } from "../features/auth/auth.store";
import { useState } from "react";

// ── Broadcast that current user is typing ────────────────
export function useTypingBroadcast(postId: string) {
  const user        = useAuthStore((s) => s.user);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onTyping() {
    if (!user) return;
    const typingRef = ref(rtdb, `typing/${postId}/${user.id}`);
    set(typingRef, { name: user.name });

    // Auto-clear after 2s of inactivity
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      remove(typingRef);
    }, 2000);
  }

  function onStopTyping() {
    if (!user) return;
    const typingRef = ref(rtdb, `typing/${postId}/${user.id}`);
    remove(typingRef);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      onStopTyping();
    };
  }, [postId, user]);

  return { onTyping, onStopTyping };
}

// ── Listen to who is typing in a post ────────────────────
export function useTypingIndicator(postId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    const typingRef = ref(rtdb, `typing/${postId}`);

    const unsub = onValue(typingRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setTypingUsers([]);
        return;
      }
      const names = Object.entries(data)
        .filter(([id]) => id !== currentUser?.id)
        .map(([, val]: any) => val.name as string);
      setTypingUsers(names);
    });

    return () => unsub();
  }, [postId, currentUser]);

  // Format: "Alice is typing...", "Alice and Bob are typing..."
  function getTypingText(): string | null {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing...`;
    if (typingUsers.length === 2) return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
    return `${typingUsers[0]} and ${typingUsers.length - 1} others are typing...`;
  }

  return { typingUsers, getTypingText };
}