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

import { auth } from "./lib/firebase"

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
};

type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;

  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  _init: () => () => void;
};

function toAuthUser(fb: FirebaseUser): AuthUser {
  return {
    id: fb.uid,
    name: fb.displayName ?? "Anonymous",
    email: fb.email ?? "",
    photoURL: fb.photoURL,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  error: null,

  loginWithEmail: async (email, password) => {
    set({ status: "loading", error: null });
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      set({ user: toAuthUser(cred.user), status: "authenticated" });
    } catch (err: any) {
      set({ error: err.message, status: "unauthenticated" });
    }
  },

  signupWithEmail: async (email, password, displayName) => {
    set({ status: "loading", error: null });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      set({ user: toAuthUser(cred.user), status: "authenticated" });
    } catch (err: any) {
      set({ error: err.message, status: "unauthenticated" });
    }
  },

  loginWithGoogle: async () => {
    set({ status: "loading", error: null });
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      set({ user: toAuthUser(cred.user), status: "authenticated" });
    } catch (err: any) {
      set({ error: err.message, status: "unauthenticated" });
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, status: "unauthenticated" });
  },

  clearError: () => set({ error: null }),

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