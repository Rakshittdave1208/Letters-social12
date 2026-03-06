// src/features/comments/components/CommentSection.tsx
import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuthStore } from "../../auth/auth.store";
import { useTypingBroadcast, useTypingIndicator } from "../../../hooks/useTyping";
import { useDeleteComment } from "../../posts/hooks/useDeletePost";
import type { Comment } from "../types";

type Props = {
  comments: Comment[];
  postId:   string;
};

export default function CommentSection({ comments, postId }: Props) {
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const user                  = useAuthStore((s) => s.user);
  const { onTyping, onStopTyping } = useTypingBroadcast(postId);
  const { getTypingText }          = useTypingIndicator(postId);
  const deleteMutation             = useDeleteComment();
  const typingText                 = getTypingText();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setLoading(true);
    onStopTyping();
    try {
      const newComment: Comment = {
        id:        crypto.randomUUID(),
        author:    user.name,
        userId:    user.id,
        content:   text.trim(),
        createdAt: new Date().toISOString(),
      };
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion(newComment),
      });
      setText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteComment(comment: Comment) {
    if (!user || user.id !== comment.userId) return;
    try {
      await deleteMutation.mutateAsync({
        postId,
        comments,
        commentId:       comment.id,
        commentAuthorId: comment.userId,
      });
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  }

  return (
    <div className="space-y-3">

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="flex gap-2 group/comment">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              {comment.author?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {comment.author}
                </span>
                {/* Delete comment — only for comment author */}
                {user?.id === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment)}
                    disabled={deleteMutation.isPending}
                    className="opacity-0 group-hover/comment:opacity-100 text-xs text-gray-400 hover:text-red-500 transition-all disabled:opacity-50 px-1"
                    title="Delete comment"
                  >
                    🗑️
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                {comment.content}
              </p>
            </div>
          </div>
        ))
      )}

      {/* Typing indicator */}
      {typingText && (
        <div className="flex items-center gap-2 px-1">
          <div className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 italic">{typingText}</span>
        </div>
      )}

      {/* Add comment */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value) onTyping();
            else onStopTyping();
          }}
          onBlur={onStopTyping}
          placeholder="Write a comment..."
          className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-full hover:opacity-80 transition disabled:opacity-40"
        >
          {loading ? "..." : "Reply"}
        </button>
      </form>
    </div>
  );
}