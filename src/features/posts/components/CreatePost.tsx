// src/features/posts/components/CreatePost.tsx
import { useState } from "react";
import Card from "../../../components/ui/Card";
import { useCreatePost } from "../hooks/useCreatePost";
import { useToast } from "../../../components/ui/Toast";
import { useAuth } from "../../auth/hooks/useAuth";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const createPost = useCreatePost();
  const { toast }  = useToast();
  const { user }   = useAuth();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  async function handleSubmit() {
    if (!content.trim()) return;
    try {
      await createPost.mutateAsync(content);
      setContent("");
      toast.success("Post shared!");
    } catch {
      toast.error("Failed to post. Try again.");
    }
  }

  return (
    <Card>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
          ) : initials}
        </div>

        {/* Input area */}
        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
            placeholder="What's on your mind?"
            rows={3}
            style={{ color: "inherit" }}
            className="w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none placeholder-gray-400 dark:placeholder-gray-500 text-sm py-1 transition-colors text-gray-900 dark:text-white"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {content.length > 0 && `${content.length} chars · Ctrl+Enter to post`}
            </span>
            <button
              onClick={handleSubmit}
              disabled={createPost.isPending || !content.trim()}
              className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-80 transition disabled:opacity-40 active:scale-95"
            >
              {createPost.isPending ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}