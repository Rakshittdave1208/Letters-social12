import React, { useState, useCallback } from "react";
import Card from "../../../components/ui/Card";
import type { Post } from "../types";
import PostActions from "./PostActions";
import CommentSection from "../../comments/components/CommentSection";
import { Link } from "react-router-dom";
import { useLikePost } from "../hooks/useLikePost";

type Props = {
  post: Post;
};

function PostCard({ post }: Props) {
  const [showComments, setShowComments] = useState(false);

  // React Query mutation
  const likeMutation = useLikePost();

  // stable callback
  const handleLike = useCallback(() => {
    likeMutation.mutate(post.id);
  }, [likeMutation, post.id]);

  return (
    <Card>
      <div className="space-y-4">

        {/* Author */}
        <div className="font-semibold text-gray-900">
          {post.author}
        </div>

        {/* Content */}
        <Link to={`/post/${post.id}`}>
          <p className="text-gray-800 leading-relaxed cursor-pointer hover:underline">
            {post.content}
          </p>
        </Link>

        {/* Actions */}
        <PostActions
          likes={post.likes}
          onLike={handleLike}
          isLiking={likeMutation.isPending}
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