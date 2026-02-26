type Props = {
  likes: number;
  onLike: () => void;
  isLiking?: boolean;
};

export default function PostActions({
  likes,
  onLike,
  isLiking,
}: Props) {
  return (
    <div className="flex items-center gap-3">

      <button
        onClick={onLike}
        disabled={isLiking}
        className="text-sm text-gray-600 hover:text-black disabled:opacity-50 transition"
      >
        ❤️ {likes}
      </button>

      {isLiking && (
        <span className="text-xs text-gray-400">
          Updating...
        </span>
      )}

    </div>
  );
}