// src/features/posts/components/PostActions.tsx
type Props = {
  likes:    number;
  onLike:   () => void;
  isLiking: boolean;
  hasLiked: boolean;
};

export default function PostActions({ likes, onLike, isLiking, hasLiked }: Props) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onLike}
        disabled={isLiking}
        className={`
          flex items-center gap-1.5 text-sm font-medium
          transition-all duration-150 active:scale-95
          disabled:opacity-50
          ${hasLiked
            ? "text-red-500 hover:text-red-600"
            : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
          }
        `}
      >
        <span className={`text-base transition-transform ${isLiking ? "scale-125" : ""}`}>
          {hasLiked ? "❤️" : "🤍"}
        </span>
        <span>{likes}</span>
        {isLiking && (
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
      </button>
    </div>
  );
}