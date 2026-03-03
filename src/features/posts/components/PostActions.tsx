// src/features/posts/components/PostActions.tsx
type Props = {
  likes:    number;
  onLike:   () => void;
  isLiking: boolean;
  hasLiked: boolean; // ← added
};

export default function PostActions({ likes, onLike, isLiking, hasLiked }: Props) {
  return (
    <button
      onClick={onLike}
      disabled={isLiking}
      className={`flex items-center gap-2 text-sm transition ${
        hasLiked
          ? "text-red-500 hover:text-red-700"
          : "text-gray-600 hover:text-black"
      }`}
    >
      {hasLiked ? "❤️" : "🤍"} {likes}
      {isLiking && <span className="text-xs text-gray-400">...</span>}
    </button>
  );
}