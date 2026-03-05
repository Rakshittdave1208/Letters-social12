// src/features/posts/components/CreatePost.tsx
import { useState } from "react";
import { useCreatePost } from "../hooks/useCreatePost";
import { useToast } from "../../../components/ui/Toast";
import { useAuth } from "../../auth/hooks/useAuth";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-rose-500 to-pink-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function CreatePost() {
  const [content, setContent]   = useState("");
  const [focused, setFocused]   = useState(false);
  const createPost = useCreatePost();
  const { toast }  = useToast();
  const { user }   = useAuth();

  const charLimit  = 280;
  const remaining  = charLimit - content.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining < 30;

  async function handleSubmit() {
    if (!content.trim() || isOverLimit) return;
    try {
      await createPost.mutateAsync(content);
      setContent("");
      setFocused(false);
      toast.success("Post shared!");
    } catch {
      toast.error("Failed to post. Try again.");
    }
  }

  if (!user) return null;

  return (
    <div className={`bg-white dark:bg-gray-900 border rounded-2xl p-5 transition-all duration-200 ${
      focused
        ? "border-blue-300 dark:border-blue-700 shadow-md"
        : "border-gray-100 dark:border-gray-800 shadow-sm"
    }`}>
      <div className="flex gap-3">
        <div className="shrink-0">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800" />
          ) : (
            <div className={`w-10 h-10 rounded-full bg-linear-to-br ${getAvatarColor(user.name)} text-white flex items-center justify-center text-sm font-bold shadow-sm`}>
              {getInitials(user.name)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => !content && setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
            placeholder="What's on your mind?"
            rows={focused ? 3 : 2}
            style={{ color: "inherit" }}
            className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none text-[15px] leading-relaxed transition-all duration-200"
          />

          {(focused || content) && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${
                  isOverLimit ? "text-red-500" :
                  isNearLimit ? "text-amber-500" :
                  "text-gray-400 dark:text-gray-500"
                }`}>
                  {remaining}
                </span>
                <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200 dark:text-gray-700" />
                  <circle
                    cx="10" cy="10" r="8"
                    fill="none" strokeWidth="2"
                    strokeDasharray={`${Math.min((content.length / charLimit) * 50.3, 50.3)} 50.3`}
                    className={isOverLimit ? "text-red-500" : isNearLimit ? "text-amber-500" : "text-blue-500"}
                    stroke="currentColor"
                  />
                </svg>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">Ctrl+Enter</span>
                <button
                  onClick={handleSubmit}
                  disabled={createPost.isPending || !content.trim() || isOverLimit}
                  className="px-5 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full hover:opacity-80 transition-all disabled:opacity-40 active:scale-95"
                >
                  {createPost.isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}