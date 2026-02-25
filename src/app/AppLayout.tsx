import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-2xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}