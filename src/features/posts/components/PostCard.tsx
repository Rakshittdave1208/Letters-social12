import Card from "../../../components/ui/Card";
import type { Post } from "../types";
import { usePostsStore } from "../posts.store";
import PostActions from "./PostActions";
import CommentSection from "../../comments/components/CommentSection";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const likePost = usePostsStore((s) => s.likePost);

  return (
    <Card>
      <div className="space-y-4">

        {/* Author */}
        <div className="font-semibold text-gray-900">
          {post.author}
        </div>

        {/* Content */}
        <p className="text-gray-800 leading-relaxed">
          {post.content}
        </p>

        {/* Actions (Like etc.) */}
        <PostActions
          likes={post.likes}
          onLike={() => likePost(post.id)}
        />

        {/* ⭐ Comment Section */}
        <CommentSection comments={post.comments ?? []} postId={""} />

      </div>
    </Card>
  );
}