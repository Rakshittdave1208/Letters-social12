// src/features/messages/MessagesPage.tsx
import { useNavigate } from "react-router-dom";
import { useConversations } from "./hooks/useMessages";
import { useAuthStore } from "../auth/auth.store";

function timeAgo(ts: any): string {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function getAvatarColor(name: string) {
  const colors = ["from-blue-500 to-indigo-600","from-purple-500 to-pink-600","from-green-500 to-teal-600","from-orange-500 to-red-600","from-cyan-500 to-blue-600"];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function MessagesPage() {
  const { conversations, loading } = useConversations();
  const user     = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
        <p className="text-4xl mb-3">🔐</p>
        <p className="font-semibold text-gray-700 dark:text-gray-300">Please log in to view messages</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">💬 Messages</h1>
        <button
          onClick={() => navigate("/search")}
          className="text-xs px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium hover:opacity-80 transition"
        >
          + New message
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">💌</p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Search for someone to start a conversation</p>
            <button
              onClick={() => navigate("/search")}
              className="mt-4 text-sm px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              Find people
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {conversations.map((conv) => {
              const otherId   = conv.participants.find((p) => p !== user.id) ?? "";
              const otherName = conv.participantNames?.[otherId] ?? "Unknown";
              const otherPhoto = conv.participantPhotos?.[otherId];
              const unread    = conv.unreadCount?.[user.id] ?? 0;

              return (
                <button
                  key={conv.id}
                  onClick={() => navigate(`/messages/${conv.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition text-left"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {otherPhoto ? (
                      <img src={otherPhoto} alt={otherName} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className={`w-11 h-11 rounded-full bg-linear-to-br ${getAvatarColor(otherName)} text-white flex items-center justify-center text-sm font-bold`}>
                        {getInitials(otherName)}
                      </div>
                    )}
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-sm font-semibold ${unread > 0 ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                        {otherName}
                      </p>
                      <span className="text-[10px] text-gray-400">{timeAgo(conv.lastMessageAt)}</span>
                    </div>
                    <p className={`text-xs truncate ${unread > 0 ? "text-gray-700 dark:text-gray-300 font-medium" : "text-gray-400"}`}>
                      {conv.lastMessage || "Start a conversation..."}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
