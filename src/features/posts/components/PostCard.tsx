// src/features/posts/components/PostCard.tsx
import React, { useState, useCallback } from "react";
import Card from "../../../components/ui/Card";
import type { Post } from "../types";
import PostActions from "./PostActions";
import CommentSection from "../../comments/components/CommentSection";
import { Link } from "react-router-dom";
import { useLikePost } from "../hooks/useLikePost";
import { useAuthStore } from "../../auth/auth.store";

type Props = {
  post: Post;
};

function PostCard({ post }: Props) {
  const [showComments, setShowComments] = useState(false);
  const likeMutation = useLikePost();
  const user = useAuthStore((s) => s.user);

  // Check if current user already liked this post
  const hasLiked = user ? post.likedBy?.includes(user.id) : false;

  const handleLike = useCallback(() => {
    likeMutation.mutate({ postId: post.id, hasLiked: !!hasLiked });
  }, [likeMutation, post.id, hasLiked]);

  return (
    <Card>
      <div className="space-y-4">
        {/* Author + time */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white">
            {post.author}
          </span>
          <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {post.createdAt}
          </span>
        </div>

        {/* Content */}
        <Link to={`/post/${post.id}`}>
          <p className="text-[15px] leading-relaxed font-medium text-gray-100 dark:text-gray-50 cursor-pointer hover:text-white transition-colors">
            {post.content}
          </p>
        </Link>

        {/* Actions */}
        <PostActions
          likes={post.likes}
          onLike={handleLike}
          isLiking={likeMutation.isPending}
          hasLiked={!!hasLiked}
        />

        {/* Toggle Comments */}
        <button
          onClick={() => setShowComments((v) => !v)}
          className="text-sm text-gray-500 hover:text-black transition"
        >
          💬 {showComments ? "Hide comments" : "Show comments"}
        </button>

        {showComments && (
          <CommentSection
            comments={post.comments ?? []}
            postId={post.id}
          />
        )}
      </div>
    </Card>
  );
}

export default React.memo(PostCard);