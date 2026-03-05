import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouteError from "../pages/RouteError";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";

const FeedPage       = lazy(() => import("../features/feed/FeedPage"));
const ProfilePage    = lazy(() => import("../features/profile/ProfilePage"));
const PostDetailPage = lazy(() => import("../features/posts/PostDetailPage"));
const LoginPage      = lazy(() => import("../features/auth/LoginPage"));
const SearchPage     = lazy(() => import("../features/search/SearchPage"));
const BookmarksPage  = lazy(() => import("../features/bookmarks/BookmarksPage"));

function PageLoader() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteError />,
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
        path: "search",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: "bookmarks",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <BookmarksPage />
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