import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import Home from "../pages/Home";
import ProfilePage from "../features/profile/ProfilePage";

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
    ],
  },
]);