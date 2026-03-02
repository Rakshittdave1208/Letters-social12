// features/auth/hooks/useAuth.ts
// ─────────────────────────────────────────────────────────
// Convenience hook — components import THIS, not the store
// directly. Keeps the store as an implementation detail.
// ─────────────────────────────────────────────────────────

import { useAuthStore } from "../auth.store";

export function useAuth() {
  const user             = useAuthStore((s) => s.user);
  const status           = useAuthStore((s) => s.status);
  const error            = useAuthStore((s) => s.error);
  const loginWithEmail   = useAuthStore((s) => s.loginWithEmail);
  const signupWithEmail  = useAuthStore((s) => s.signupWithEmail);
  const loginWithGoogle  = useAuthStore((s) => s.loginWithGoogle);
  const logout           = useAuthStore((s) => s.logout);
  const clearError       = useAuthStore((s) => s.clearError);

  return {
    user,
    status,
    error,
    isAuthenticated: status === "authenticated",
    isLoading:       status === "loading" || status === "idle",
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    logout,
    clearError,
  };
}