// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouteError from "../pages/RouteError";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";

const FeedPage          = lazy(() => import("../features/feed/FeedPage"));
const ProfilePage       = lazy(() => import("../features/profile/ProfilePage"));
const EditProfilePage   = lazy(() => import("../features/profile/EditProfilePage"));
const PostDetailPage    = lazy(() => import("../features/posts/PostDetailPage"));
const LoginPage         = lazy(() => import("../features/auth/LoginPage"));
const SearchPage        = lazy(() => import("../features/search/SearchPage"));
const BookmarksPage     = lazy(() => import("../features/bookmarks/BookmarksPage"));
const AnalyticsPage     = lazy(() => import("../features/analytics/AnalyticsPage"));
const MessagesPage      = lazy(() => import("../features/messages/MessagesPage"));
const ChatPage          = lazy(() => import("../features/messages/ChatPage"));

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
      { index: true, element: (<Suspense fallback={<PageLoader />}><FeedPage /></Suspense>) },
      { path: "post/:id", element: (<Suspense fallback={<PageLoader />}><PostDetailPage /></Suspense>) },
      { path: "search",   element: (<Suspense fallback={<PageLoader />}><SearchPage /></Suspense>) },
      { path: "login",    element: (<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>) },
      {
        path: "profile",
        element: (<ProtectedRoute><Suspense fallback={<PageLoader />}><ProfilePage /></Suspense></ProtectedRoute>),
      },
      {
        path: "profile/edit",
        element: (<ProtectedRoute><Suspense fallback={<PageLoader />}><EditProfilePage /></Suspense></ProtectedRoute>),
      },
      {
        path: "analytics",
        element: (<ProtectedRoute><Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense></ProtectedRoute>),
      },
      {
        path: "messages",
        element: (<ProtectedRoute><Suspense fallback={<PageLoader />}><MessagesPage /></Suspense></ProtectedRoute>),
      },
      {
        path: "messages/:id",
        element: (<ProtectedRoute><Suspense fallback={<PageLoader />}><ChatPage /></Suspense></ProtectedRoute>),
      },
      {
        path: "bookmarks",
        element: (<ProtectedRoute><Suspense fallback={<PageLoader />}><BookmarksPage /></Suspense></ProtectedRoute>),
      },
    ],
  },
]);