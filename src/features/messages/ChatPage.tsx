import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChat } from "./hooks/useMessages";
import { useAuthStore } from "../auth/auth.store";
import type { Conversation } from "./types";

function formatTime(ts: any): string {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function getAvatarColor(name: string) {
  const colors = ["from-blue-500 to-indigo-600","from-purple-500 to-pink-600","from-green-500 to-teal-600","from-orange-500 to-red-600","from-cyan-500 to-blue-600"];
  return colors[name.charCodeAt(0) % colors.length];
}

export default function ChatPage() {
  const { id: conversationId } = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const user      = useAuthStore((s) => s.user);
  const { messages, loading, sendMessage } = useChat(conversationId ?? "");
  const [text, setText]         = useState("");
  const [conv, setConv]         = useState<Conversation | null>(null);
  const bottomRef               = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (!conversationId) return;
    getDoc(doc(db, "conversations", conversationId)).then((snap) => {
      if (snap.exists()) setConv({ id: snap.id, ...snap.data() } as Conversation);
    });
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
  }

  const otherId    = conv?.participants.find((p) => p !== user?.id) ?? "";
  const otherName  = conv?.participantNames?.[otherId] ?? "Unknown";
  const otherPhoto = conv?.participantPhotos?.[otherId];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button
          onClick={() => navigate("/messages")}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1"
        >
          ←
        </button>
        {otherPhoto ? (
          <img src={otherPhoto} alt={otherName} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className={`w-9 h-9 rounded-full bg-linear-to-br ${getAvatarColor(otherName)} text-white flex items-center justify-center text-xs font-bold`}>
            {getInitials(otherName)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{otherName}</p>
          <p className="text-[10px] text-green-500">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">👋</p>
            <p className="text-sm text-gray-400">Say hello to {otherName}!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderId === user?.id;
            const showTime = i === messages.length - 1 ||
              messages[i + 1]?.senderId !== msg.senderId;

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                  {showTime && (
                    <span className="text-[10px] text-gray-400 px-1">{formatTime(msg.createdAt)}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${otherName}...`}
          className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e as any);
            }
          }}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-9 h-9 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition active:scale-95"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
