import { useFeed } from "../hooks/useFeed";
import PostCard from "../../posts/components/PostCard";
import CreatePost from "../../posts/components/CreatePost";
import { usePosts } from "../../posts/hooks/usePosts";

export default function Feed() {
  const { posts, loading, error } = useFeed();
  const { addPost } = usePosts();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-4">
      <CreatePost onCreate={addPost} />

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}