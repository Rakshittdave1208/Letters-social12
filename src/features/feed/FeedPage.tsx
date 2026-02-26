import PageLayout from "../posts/components/layout/PageLayout";
import AsyncBoundary from "../../components/common/AsyncBoundary";
import { useInfinitePosts } from "../../features/posts/hooks/useInfinitePosts";
import PostCard from "../../features/posts/components/PostCard";

export default function FeedPage() {
  const query = useInfinitePosts();
  const posts = query.data?.pages.flat() ?? [];

  return (
    <PageLayout>
      <AsyncBoundary
        isLoading={query.isLoading}
        error={query.error}
      >
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </AsyncBoundary>
    </PageLayout>
  );
}