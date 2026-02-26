import { useParams } from "react-router-dom";
import { usePostQuery } from "./hooks/usePostsQuery";
import PostCard from "./components/PostCard";

export default function PostDetailPage() {
  const { id } = useParams();

  const { data: post, isLoading } = usePostQuery(id);

  if (isLoading) return <p>Loading...</p>;

  if (!post) return <p>Post not found</p>;

  return <PostCard post={post} />;
}