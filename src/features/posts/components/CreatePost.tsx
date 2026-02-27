import { useState } from "react";
import Card from "../../../components/ui/Card";
import { useCreatePost } from "../hooks/useCreatePost";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const createPost = useCreatePost();

  function handleSubmit() {
    if (!content.trim()) return;

    createPost.mutate(content);
    setContent("");
  }

  return (
    <Card>
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border rounded-md p-2"
        />

        <button
          onClick={handleSubmit}
          disabled={createPost.isPending}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          {createPost.isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </Card>
  );
}