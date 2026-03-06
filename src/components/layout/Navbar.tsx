import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useDarkMode } from "../../features/posts/hooks/useDarkMode";

export default function Navbar() {
  const { user } = useAuth();
  const { isDark, toggle } = useDarkMode();
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200
     dark:border-gray-700 shadow-sm transition-colors">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink to="/" className="font-bold text-lg tracking-tight hover:opacity-80 transition text-gray-900 dark:text-white">
          Letters
        </NavLink>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <NavItem to="/" end>Home</NavItem>
          <NavItem to="/search">Search</NavItem>
          <NavItem to="/bookmarks">Bookmarks</NavItem>
          <NavItem to="/profile">Profile</NavItem>
        </nav>
        <div className="flex items-center gap-1">
          <button onClick={toggle} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {isDark ? "☀️" : "🌙"}
          </button>
          {user ? <UserMenu /> : (
            <NavLink to="/login" className="px-4 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition ml-1">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initials = user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div ref={ref} className="relative ml-1">
      <button onClick={() => setOpen((o) => !o)} className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2
           ring-gray-200 dark:ring-gray-700" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600
           text-white flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border
         border-gray-100 dark:border-gray-700 py-1 z-50">
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
          <button onClick={() => { setOpen(false); logout(); }} className="w-full text-left px-4 py-2.5 text-sm
           text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

type NavItemProps = { to: string; children: ReactNode; end?: boolean };

function NavItem({ to, children, end }: NavItemProps) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) =>
      `px-3 py-1 rounded-md text-sm transition-all duration-200 ${isActive
        ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold"
        : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}>
      {children}
    </NavLink>
  );
}