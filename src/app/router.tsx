import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouteError from "../pages/RouteError";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";

/* ---------- Lazy Loaded Pages ---------- */

const FeedPage = lazy(() => import("../features/feed/FeedPage"));
const ProfilePage = lazy(() => import("../features/profile/ProfilePage"));
const PostDetailPage = lazy(
  () => import("../features/posts/PostDetailPage")
);
const LoginPage = lazy(
  () => import("../features/auth/LoginPage")
);

/* ---------- Reusable Loader ---------- */

function PageLoader() {
  return (
    <div className="p-6 text-center text-gray-500">
      Loading page...
    </div>
  );
}

/* ---------- Router ---------- */

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteError />, // ⭐ added error element
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <FeedPage />
          </Suspense>
        ),
      },

      {
        path: "post/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PostDetailPage />
          </Suspense>
        ),
      },

      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: "login",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },
]);