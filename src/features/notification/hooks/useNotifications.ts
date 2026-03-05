// src/features/notifications/hooks/useNotifications.ts
import { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/auth.store";
import { subscribeNotifications,markAsRead,type Notification } from "../notification.api";
export function useNotifications() {
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeNotifications(user.id, setNotifications);
    return unsub;
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    if (!user) return;
    await markAsRead(user.id, id);
  };

  const markAllRead = async () => {
    if (!user) return;
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => markAsRead(user.id, n.id)));
  };

  return { notifications, unreadCount, markRead, markAllRead };
}