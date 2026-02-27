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
    <button
      onClick={onLike}
      disabled={isLiking}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
    >
      ❤️ {likes}
      {isLiking && <span>Updating...</span>}
    </button>
  );
}