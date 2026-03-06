// src/hooks/usePresence.ts
import { useEffect } from "react";
import { ref, set, onDisconnect, onValue, serverTimestamp } from "firebase/database";
import { rtdb } from "../lib/firebase";
import { useAuthStore } from "../features/auth/auth.store";
import { useState } from "react";

export type OnlineUser = {
  id:       string;
  name:     string;
  photoURL: string | null;
  onlineAt: number;
};

// ── Register current user as online ──────────────────────
export function usePresence() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const userRef = ref(rtdb, `presence/${user.id}`);

    // Set online status
    set(userRef, {
      id:       user.id,
      name:     user.name,
      photoURL: user.photoURL,
      onlineAt: Date.now(),
    });

    // Auto-remove when user disconnects
    onDisconnect(userRef).remove();

    return () => {
      set(userRef, null);
    };
  }, [user]);
}

// ── Get all online users ──────────────────────────────────
export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    const presenceRef = ref(rtdb, "presence");

    const unsub = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setOnlineUsers([]);
        return;
      }
      const users = Object.values(data) as OnlineUser[];
      // Exclude current user from the list
      setOnlineUsers(users.filter((u) => u.id !== currentUser?.id));
    });

    return () => unsub();
  }, [currentUser]);

  return onlineUsers;
}
