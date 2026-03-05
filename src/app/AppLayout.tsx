// src/app/AppLayout.tsx
import { useEffect } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import Navbar from "../components/layout/Navbar";
import { useAuthStore } from "../features/auth/auth.store";
import { ToastContainer } from "../components/ui/Toast";

export default function AppLayout() {
  const navigation  = useNavigation();
  const isFetching  = useIsFetching();
  const isMutating  = useIsMutating();
  const initAuth    = useAuthStore((s) => s._init);

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, []);

  const isNavigating = navigation.state === "loading";
  const isBusy = isNavigating || isFetching > 0 || isMutating > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />

      {/* Global loading bar */}
      <div
        className={`h-0.5 bg-blue-500 transition-all duration-300 ${
          isBusy ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Page content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}