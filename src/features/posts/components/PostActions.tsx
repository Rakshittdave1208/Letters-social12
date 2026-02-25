type Props={
  likes:number;
  onLike:()=>void
};

export default function PostActions({likes,onLike}:Props){
  return(
    <div className="flex justify-between items-center text-sm text-gray-500">
      <button onClick={onLike}
      className="hover:text-black transition">
       ❤️ {likes}
      </button>
    </div>
  )
}