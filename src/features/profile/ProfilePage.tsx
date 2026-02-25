import PageContainer from "../../components/ui/PageContainer";
import { usePostsStore } from "../posts/posts.store";
import PostCard from "../posts/components/PostCard";
import { selectMyPosts } from "../posts/posts.selectors";

export default function ProfilePage() {
  const posts = usePostsStore((s) => s.posts);

  const myPosts = selectMyPosts(posts);

  return (
    <PageContainer>
      <h1 className="text-xl font-semibold mb-4">
        Your Profile
      </h1>

      <div className="space-y-4">
        {myPosts.length === 0 ? (
          <p className="text-gray-500 text-sm">
            You haven't posted anything yet.
          </p>
        ) : (
          myPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </PageContainer>
  );
}