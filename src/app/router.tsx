import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import Home from "../pages/Home";
import ProfilePage from "../features/profile/ProfilePage";
import PostDetailPage from "../features/posts/PostDetailPage";
import LoginPage from "../features/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path:"/post/:id",
        element:<PostDetailPage/>
      },
      {
        path:"/login",
        element:<LoginPage/>
      },
      {
  path: "/profile",
  element: (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
}
    ],
  },
]);