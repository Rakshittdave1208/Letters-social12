// features/auth/auth.store.ts
// ─────────────────────────────────────────────────────────
// Replaces the mock login/logout with real Firebase Auth.
// Keeps the same shape your app already uses, so zero
// changes needed in consuming components.
// ─────────────────────────────────────────────────────────

import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth } from "./lib/firebase";

// ─── Types ────────────────────────────────────────────────
export type AuthUser = {
  id:          string;
  name:        string;
  email:       string;
  photoURL:    string | null;
};

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  [x: string]: any;
  user:   AuthUser | null;
  status: AuthStatus;
  error:  string | null;

  // Actions
  loginWithEmail:    (email: string, password: string) => Promise<void>;
  signupWithEmail:   (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle:   () => Promise<void>;
  logout:            () => Promise<void>;
  clearError:        () => void;
  _init:             () => () => void; // returns unsubscribe — called once in App
};

// ─── Helper: map Firebase user → our AuthUser ─────────────
function toAuthUser(fb: FirebaseUser): AuthUser {
  return {
    id:       fb.uid,
    name:     fb.displayName ?? "Anonymous",
    email:    fb.email ?? "",
    photoURL: fb.photoURL,
  };
}

// ─── Store ────────────────────────────────────────────────
export const useAuthStore = create<AuthState>((set) => ({
  user:   null,
  status: "idle",
  error:  null,

  // ── Email / Password login ────────────────────────────
  loginWithEmail: async (email, password) => {
    set({ status: "loading", error: null });
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      set({ user: toAuthUser(cred.user), status: "authenticated" });
    } catch (err: any) {
      set({ error: friendlyError(err.code), status: "unauthenticated" });
    }
  },

  // ── Email / Password signup ───────────────────────────
  signupWithEmail: async (email, password, displayName) => {
    set({ status: "loading", error: null });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      set({ user: toAuthUser(cred.user), status: "authenticated" });
    } catch (err: any) {
      set({ error: friendlyError(err.code), status: "unauthenticated" });
    }
  },

  // ── Google OAuth ─────────────────────────────────────
  loginWithGoogle: async () => {
    set({ status: "loading", error: null });
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      set({ user: toAuthUser(cred.user), status: "authenticated" });
    } catch (err: any) {
      set({ error: friendlyError(err.code), status: "unauthenticated" });
    }
  },

  // ── Logout ────────────────────────────────────────────
  logout: async () => {
    await signOut(auth);
    set({ user: null, status: "unauthenticated" });
  },

  // ── Clear error ───────────────────────────────────────
  clearError: () => set({ error: null }),

  // ── Init: subscribe to Firebase auth state ────────────
  // Call once at app start (in App.tsx via useEffect).
  // Returns the unsubscribe function so cleanup is automatic.
  _init: () => {
    set({ status: "loading" });
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        set({ user: toAuthUser(fbUser), status: "authenticated" });
      } else {
        set({ user: null, status: "unauthenticated" });
      }
    });
    return unsub;
  },
}));

// ─── Human-readable Firebase error messages ───────────────
function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-email":            "Invalid email address.",
    "auth/user-disabled":            "This account has been disabled.",
    "auth/user-not-found":           "No account found with that email.",
    "auth/wrong-password":           "Incorrect password.",
    "auth/email-already-in-use":     "An account already exists with that email.",
    "auth/weak-password":            "Password must be at least 6 characters.",
    "auth/popup-closed-by-user":     "Sign-in popup was closed.",
    "auth/network-request-failed":   "Network error. Check your connection.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}