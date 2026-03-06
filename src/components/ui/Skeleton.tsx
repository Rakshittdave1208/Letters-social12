// src/components/ui/Skeleton.tsx

function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBox className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <SkeletonBox className="h-3 w-32" />
          <SkeletonBox className="h-2 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-4/5" />
        <SkeletonBox className="h-3 w-3/5" />
      </div>
      <div className="flex gap-3 pt-1">
        <SkeletonBox className="h-8 w-16 rounded-lg" />
        <SkeletonBox className="h-8 w-24 rounded-lg" />
        <SkeletonBox className="h-8 w-16 rounded-lg ml-auto" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <SkeletonBox className="w-20 h-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <SkeletonBox className="h-5 w-40" />
          <SkeletonBox className="h-3 w-52" />
          <SkeletonBox className="h-3 w-24" />
        </div>
      </div>
      <div className="flex gap-6 border-t border-gray-100 dark:border-gray-800 pt-4">
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-3 w-20" />
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-3">
      <SkeletonBox className="w-10 h-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <SkeletonBox className="h-3 w-32" />
        <SkeletonBox className="h-2 w-20" />
      </div>
      <SkeletonBox className="h-8 w-20 rounded-full" />
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => <PostCardSkeleton key={i} />)}
    </div>
  );
}
export default SkeletonBox;