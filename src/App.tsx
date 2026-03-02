// App.tsx
// ─────────────────────────────────────────────────────────
// Three jobs:
//  1. Initialise Firebase auth listener (once, on mount)
//  2. Sync auth user → posts store so currentUserId is real
//  3. Declare all routes with protected guard
// ─────────────────────────────────────────────────────────

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore }  from "./features/auth/auth.store";
import { usePostsStore } from "./features/posts/posts.store";

import ProtectedRoute from "./app/ProtectedRoute";
import LoginPage      from "./features/auth/LoginPage";
import FeedPage       from "./features/feed/FeedPage";
import ProfilePage    from "./features/profile/ProfilePage";
import RouteError     from "./pages/RouteError";
console.log("ENV CHECK:", import.meta.env.VITE_FIREBASE_API_KEY); // ← ADD THIS

export default function App() {
  const initAuth       = useAuthStore((s) => s._init);
  const authUser       = useAuthStore((s) => s.user);
  const setCurrentUser = usePostsStore((s) => s.setCurrentUser);

  // ── 1. Start Firebase auth listener ───────────────────
  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe; // cleanup on unmount
  }, []);

  // ── 2. Keep posts store in sync with real user id ─────
  useEffect(() => {
    setCurrentUser(authUser?.id ?? null);
  }, [authUser]);

  // ── 3. Routes ─────────────────────────────────────────
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Fallbacks */}
        <Route path="/404"  element={<RouteError />} />
        <Route path="*"     element={<Navigate to="/404" replace />} />

      </Routes>
    </BrowserRouter>
    
  );
}
