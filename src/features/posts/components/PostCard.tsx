// src/features/posts/components/PostCard.tsx
import React, { useState, useCallback } from "react";
import type { Post } from "../types";
import CommentSection from "../../comments/components/CommentSection";
import { Link } from "react-router-dom";
import { useLikePost } from "../hooks/useLikePost";
import { useAuthStore } from "../../auth/auth.store";
import { useBookmarks } from "../../bookmarks/hooks/useBookmarks";

type Props = { post: Post };

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-rose-500 to-pink-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function PostCard({ post }: Props) {
  const [showComments, setShowComments] = useState(false);
  const likeMutation = useLikePost();
  const user         = useAuthStore((s) => s.user);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const hasLiked   = user ? post.likedBy?.includes(user.id) : false;
  const bookmarked = isBookmarked(post.id);

  const handleLike = useCallback(() => {
    likeMutation.mutate({ postId: post.id, hasLiked: !!hasLiked });
  }, [likeMutation, post.id, hasLiked]);

  return (
    <article className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full bg-linear-to-br ${getAvatarColor(post.author)} text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm`}>
            {getInitials(post.author)}
          </div>
          {/* Name + time */}
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
              {post.author}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {post.createdAt}
            </p>
          </div>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmark(post)}
          className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${bookmarked ? "opacity-100 text-amber-500" : "text-gray-400"}`}
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          {bookmarked ? "🔖" : "🔖"}
        </button>
      </div>

      {/* Content */}
      <Link to={`/post/${post.id}`} className="block mb-4">
        <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-100 hover:text-black dark:hover:text-white transition-colors">
          {post.content}
        </p>
      </Link>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
        <div className="flex items-center gap-1">

          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95 disabled:opacity-50 ${
              hasLiked
                ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500"
            }`}
          >
            <span className="text-base">{hasLiked ? "❤️" : "🤍"}</span>
            <span>{post.likes}</span>
            {likeMutation.isPending && (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
          </button>

          {/* Comment button */}
          <button
            onClick={() => setShowComments((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              showComments
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500"
            }`}
          >
            <span className="text-base">💬</span>
            <span>{showComments ? "Hide" : "Comment"}</span>
          </button>

          {/* Share button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-500 transition-all duration-150 ml-auto"
          >
            <span className="text-base">🔗</span>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <CommentSection
            comments={post.comments ?? []}
            postId={post.id}
          />
        </div>
      )}
    </article>
  );
}

export default React.memo(PostCard);