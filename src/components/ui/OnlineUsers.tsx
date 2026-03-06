// src/components/ui/OnlineUsers.tsx
import { useOnlineUsers } from "../../hooks/usePresence";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function getAvatarColor(name:string){
  const colors=["from-blue-500 to-indigo-600","from-purple-500 to-pink-600","from-green-500 to-teal-600","from-orange-500 to-red-600"];
  return colors[name.charCodeAt(0)%colors.length]
}
export default function OnlineUsers() {
  const onlineUsers = useOnlineUsers();

  if (onlineUsers.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Online now ({onlineUsers.length})
      </h3>
      <div className="space-y-2">
        {onlineUsers.slice(0, 5).map((u) => (
          <div key={u.id} className="flex items-center gap-2">
            <div className="relative">
              {u.photoURL ? (
                <img src={u.photoURL} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className={`w-7 h-7 rounded-full bg-linear-to-br ${getAvatarColor(u.name)} text-white flex items-center justify-center text-[10px] font-bold`}>
                  {getInitials(u.name)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate">{u.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}