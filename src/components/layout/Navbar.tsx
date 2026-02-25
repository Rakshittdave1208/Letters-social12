import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <NavLink
          to="/"
          className="font-bold text-lg tracking-tight hover:opacity-80 transition"
        >
          Letters Social
        </NavLink>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <NavItem to="/" end>
            Home
          </NavItem>

          <NavItem to="/profile">
            Profile
          </NavItem>
        </nav>

        {/* Right side */}
        <NavLink
          to="/login"
          className="px-4 py-1.5 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 transition active:scale-95"
        >
          Login
        </NavLink>

      </div>
    </header>
  );
}

/* ---------- NavItem Component ---------- */

type NavItemProps = {
  to: string;
  children: ReactNode;
  end?: boolean;
};

function NavItem({ to, children, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `px-3 py-1 rounded-md transition-all duration-200 ${
          isActive
            ? "bg-gray-100 text-black font-semibold"
            : "text-gray-500 hover:text-black hover:bg-gray-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}