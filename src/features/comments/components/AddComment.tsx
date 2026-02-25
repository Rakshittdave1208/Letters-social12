import { useState } from "react";

type Props = {
  onAdd: (content: string) => void;
};

export default function AddComment({ onAdd }: Props) {
  const [text, setText] = useState("");

  function hamdleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd(text);
    setText("")
  }
  return (
    <form onSubmit={hamdleSubmit} className="flex gap-2 pt-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 border rounded px-2 py-1 text-sm"
      />

      <button
        type="submit"
        className="text-sm bg-black text-white px-3 rounded"
      >
        Post
      </button>
    </form>
  );
}