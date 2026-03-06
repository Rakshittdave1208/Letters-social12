// src/features/posts/components/PostCard.tsx
import React, { useState, useCallback } from "react";
import type { Post } from "../types";
import CommentSection from "../../comments/components/CommentSection";
import { Link } from "react-router-dom";
import { useLikePost } from "../hooks/useLikePost";
import { useDeletePost } from "../hooks/useDeletePost";
import { useAuthStore } from "../../auth/auth.store";
import { useBookmarks } from "../../bookmarks/hooks/useBookmarks";
import { useToast } from "../../../components/ui/Toast";

type Props = { post: Post };

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function getAvatarColor(name: string) {
  const colors = ["from-blue-500 to-indigo-600","from-purple-500 to-pink-600","from-green-500 to-teal-600","from-orange-500 to-red-600","from-cyan-500 to-blue-600","from-rose-500 to-pink-600"];
  return colors[name.charCodeAt(0) % colors.length];
}

function PostCard({ post }: Props) {
  const [showComments, setShowComments]   = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const likeMutation   = useLikePost();
  const deleteMutation = useDeletePost();
  const user           = useAuthStore((s) => s.user);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();

  const hasLiked   = user ? post.likedBy?.includes(user.id) : false;
  const bookmarked = isBookmarked(post.id);
  const isAuthor   = user?.id === post.userId;

  const handleLike = useCallback(() => {
    likeMutation.mutate({ postId: post.id, hasLiked: !!hasLiked });
  }, [likeMutation, post.id, hasLiked]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  }, [post.id, toast]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync({ postId: post.id, authorId: post.userId });
      toast.success("Post deleted");
      setConfirmDelete(false);
    } catch {
      toast.error("Failed to delete post");
    }
  }, [deleteMutation, post.id, post.userId, toast]);

  return (
    <article className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-linear-to-br ${getAvatarColor(post.author)} text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm`}>
            {getInitials(post.author)}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{post.author}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{post.createdAt}</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(post)}
            className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${bookmarked ? "opacity-100 text-amber-500" : "text-gray-400"}`}
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            🔖
          </button>

          {/* Delete — only for author */}
          {isAuthor && (
            confirmDelete ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Delete?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "..." : "Yes"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"
                title="Delete post"
              >
                🗑️
              </button>
            )
          )}
        </div>
      </div>

      {/* Content */}
      <Link to={`/post/${post.id}`} className="block mb-4">
        <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors">
          {post.content}
        </p>
      </Link>

      {/* Actions */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
        <div className="flex items-center gap-1">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 ${
              hasLiked
                ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500"
            }`}
          >
            <span>{hasLiked ? "❤️" : "🤍"}</span>
            <span>{post.likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              showComments
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500"
            }`}
          >
            <span>💬</span>
            <span>Comment</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-500 transition-all duration-150 ml-auto"
          >
            <span>🔗</span>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <CommentSection comments={post.comments ?? []} postId={post.id} />
        </div>
      )}
    </article>
  );
}

export default React.memo(PostCard);