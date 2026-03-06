import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import Providers from "./app/provider";
import { useAuthStore } from "./features/auth/auth.store";
import "./index.css";

// Initialize dark mode from localStorage
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}

// Start Firebase auth listener BEFORE app renders
// This ensures user is available when components mount
useAuthStore.getState()._init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>
);