import AppPage from "../../components/common/AppPage";
import InfiniteLoader from "../../components/common/InfiniteLoader";

import { useInfinitePosts } from "../posts/hooks/useInfinitePosts";
import PostCard from "../posts/components/PostCard";
import CreatePost from "../posts/components/CreatePost";
import PostSkeleton from "../posts/components/PostSkeleton";

export default function FeedPage() {
  const query = useInfinitePosts();

  const posts = query.data?.pages.flat() ?? [];

  return (
    <AppPage
      isLoading={query.isLoading}
      error={query.error}
    >
      <div className="space-y-4">

        {/* ⭐ CREATE POST INPUT */}
        <CreatePost />

        {/* ⭐ POSTS */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* ⭐ SKELETON LOADING FOR NEXT PAGE */}
        {query.isFetchingNextPage && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {/* ⭐ INFINITE LOADER */}
        <InfiniteLoader
          hasNextPage={query.hasNextPage}
          isFetching={query.isFetchingNextPage}
          onLoadMore={() => query.fetchNextPage()}
        />

      </div>
    </AppPage>
  );
}