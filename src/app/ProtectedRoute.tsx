// src/app/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth();

  // ── Firebase is still resolving persisted session ───
  // Without this check, it instantly redirects to /login
  // on every page refresh before auth state is known.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
