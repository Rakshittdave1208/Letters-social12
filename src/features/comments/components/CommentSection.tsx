import type { Comment } from "../types";
import AddComment from "./AddComment";
import { usePostsStore } from "../../posts/posts.store";

type Props = {
  comments: Comment[];
  postId: string;
};

export default function CommentSection({ comments, postId }: Props) {
  const addComment = usePostsStore((s) => s.addComment);

  return (
    <div className="space-y-3 border-t pt-3">

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400">
          No comments yet.
        </p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="text-sm">
            <span className="font-medium text-gray-900">
              {comment.author}
            </span>
            <p className="text-gray-700">
              {comment.content}
            </p>
          </div>
        ))
      )}

      {/* Add Comment Input */}
      <AddComment
        onAdd={(text) => addComment(postId, text)}
      />
    </div>
  );
}