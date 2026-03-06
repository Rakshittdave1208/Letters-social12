// src/app/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { useDarkMode } from "../posts/hooks/useDarkMode";
import { ToastContainer } from "../../components/ui/Toast";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function getAvatarColor(name: string) {
  const colors = ["from-blue-500 to-indigo-600","from-purple-500 to-pink-600","from-green-500 to-teal-600","from-orange-500 to-red-600","from-cyan-500 to-blue-600"];
  return colors[name.charCodeAt(0) % colors.length];
}

const navItems = [
  { to: "/",          end: true,  icon: "🏠", label: "Home"      },
  { to: "/search",    end: false, icon: "🔍", label: "Search"    },
  { to: "/bookmarks", end: false, icon: "🔖", label: "Bookmarks" },
  { to: "/profile",   end: false, icon: "👤", label: "Profile"   },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen transition-colors">
      <div className="max-w-5xl mx-auto px-4 flex gap-6 py-6">

        {/* Left Sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-6 h-fit gap-1">
          {/* Logo */}
          <div className="px-3 py-4 mb-2">
            <span className="font-logo text-3xl text-gray-900 dark:text-white">Letters</span>
          </div>

          {navItems.map(({ to, end, icon, label }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-sm"
              }`
            }>
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}

          <button
            onClick={toggle}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-sm transition-all mt-1"
          >
            <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
            {isDark ? "Light mode" : "Dark mode"}
          </button>

          {user && (
            <div className="mt-4 p-3 rounded-2xl card-premium">
              <div className="flex items-center gap-2 mb-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className={`w-8 h-8 rounded-full bg-linear-to-br ${getAvatarColor(user.name)} text-white flex items-center justify-center text-xs font-bold`}>
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full text-xs text-red-500 hover:text-red-600 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition text-center font-medium"
              >
                Sign out
              </button>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-xl">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between mb-4 sticky top-0 z-50 py-3">
            <span className="font-logo text-2xl text-gray-900 dark:text-white">Letters</span>
            <div className="flex items-center gap-1">
              {navItems.map(({ to, end, icon }) => (
                <NavLink key={to} to={to} end={end} className={({ isActive }) =>
                  `w-9 h-9 flex items-center justify-center rounded-xl text-base transition ${
                    isActive ? "bg-gray-900 dark:bg-white" : "hover:bg-white dark:hover:bg-gray-800"
                  }`
                }>
                  {icon}
                </NavLink>
              ))}
              <button onClick={toggle} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-gray-800 transition">
                {isDark ? "☀️" : "🌙"}
              </button>
            </div>
          </div>

          <Outlet />
        </main>

        {/* Right sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-6 h-fit space-y-4">
          <div className="card-premium rounded-2xl p-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">✨ Tips</h3>
            <ul className="space-y-2.5 text-xs text-gray-500 dark:text-gray-400">
              <li className="flex items-start gap-2"><span>⌨️</span> Use Ctrl+Enter to post quickly</li>
              <li className="flex items-start gap-2"><span>🔖</span> Hover a post to bookmark it</li>
              <li className="flex items-start gap-2"><span>🔗</span> Share posts with the link button</li>
              <li className="flex items-start gap-2"><span>🌙</span> Toggle dark mode anytime</li>
            </ul>
          </div>

          <div className="bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
            <h3 className="font-logo text-xl italic mb-1">Letters Social</h3>
            <p className="text-xs opacity-80 leading-relaxed">A real-time social platform built with React, Firebase & Tailwind.</p>
          </div>
        </aside>

      </div>
      <ToastContainer />
    </div>
  );
}