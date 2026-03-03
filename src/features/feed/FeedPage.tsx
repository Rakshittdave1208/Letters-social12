// src/features/feed/FeedPage.tsx
// ─────────────────────────────────────────────────────────
// Now uses useRealtimeFeed instead of useInfinitePosts.
// Feed updates instantly when any user posts or likes.
// ─────────────────────────────────────────────────────────

import AppPage from "../../components/common/AppPage";
import InfiniteLoader from "../../components/common/InfiniteLoader";
import PostCard from "../posts/components/PostCard";
import CreatePost from "../posts/components/CreatePost";
import PostSkeleton from "../posts/components/PostSkeleton";
import { useRealtimeFeed } from "../posts/hooks/useRealtime";

export default function FeedPage() {
  const { posts, isLoading, error, hasMore, isFetchingMore, loadMore } =
    useRealtimeFeed();

  return (
    <AppPage isLoading={isLoading} error={error}>
      <div className="space-y-4">

        {/* ⭐ CREATE POST */}
        <CreatePost />

        {/* ⭐ LIVE POSTS */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* ⭐ SKELETON WHILE LOADING MORE */}
        {isFetchingMore && (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {/* ⭐ INFINITE LOADER */}
        <InfiniteLoader
          hasNextPage={hasMore}
          isFetching={isFetchingMore}
          onLoadMore={loadMore}
        />

        {/* ⭐ END OF FEED */}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-sm text-gray-400 py-4">
            You've reached the end ✨
          </p>
        )}

      </div>
    </AppPage>
  );
}