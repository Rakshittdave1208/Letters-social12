import { useParams } from "react-router-dom";
import { usePosts } from "./hooks/usePosts";
import PostCard from "./components/PostCard";
import PageContainer from "../../components/ui/PageContainer";

export default function PostDetailPage() {
  const { id } = useParams();
  const { posts } = usePosts();

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return <p className="p-6">Post not found</p>;
  }

  return (
    <PageContainer>
      <PostCard post={post} />
    </PageContainer>
  );
}