// src/features/follow/hooks/useFollow.ts
import { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/auth.store";
import { followUser, unfollowUser, subscribeFollowing, subscribeFollowCounts } from "../follow.api"
import { createNotification } from "../../notification/notification.api"
import { useToast } from "../../../components/ui/Toast";

export function useFollow(targetId: string, targetName: string) {
  const user          = useAuthStore((s) => s.user);
  const { toast }     = useToast();
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);

  const isFollowing = followingIds.includes(targetId);

  // Subscribe to current user's following list
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeFollowing(user.id, setFollowingIds);
    return unsub;
  }, [user]);

  // Subscribe to target's follower counts
  useEffect(() => {
    if (!targetId) return;
    const unsub = subscribeFollowCounts(targetId, setCounts);
    return unsub;
  }, [targetId]);

  const toggle = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.id, targetId);
        toast.info(`Unfollowed ${targetName}`);
      } else {
        await followUser(user.id, user.name, targetId, targetName);
        // Send notification to target user
        await createNotification(targetId, {
          type:       "follow",
          fromUserId: user.id,
          fromName:   user.name,
          message:    `${user.name} started following you`,
        });
        toast.success(`Following ${targetName}! 🎉`);
      }
    } catch {
      toast.error("Failed to update follow.");
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, counts, loading, toggle };
}