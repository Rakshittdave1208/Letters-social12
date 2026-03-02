// components/ui/ProtectedRoute.tsx
// ─────────────────────────────────────────────────────────
// Wraps any route that requires auth.
// Shows a spinner while Firebase resolves the session,
// then redirects to /login if unauthenticated.
// ─────────────────────────────────────────────────────────

import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Firebase is still resolving the persisted session → show nothing yet.
  // (This only flashes on the very first load; afterwards it's instant.)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}