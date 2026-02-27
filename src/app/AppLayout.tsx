import { Outlet, useNavigation } from "react-router-dom";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import Navbar from "../components/layout/Navbar";

export default function AppLayout() {
  const navigation = useNavigation();

  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isNavigating = navigation.state === "loading";

  // 🔥 Unified busy state
  const isBusy =
    isNavigating || isFetching > 0 || isMutating > 0;

  return (
    <div>
      <Navbar />

      {/* Smooth global loading bar */}
      <div
        className={`
          h-1 bg-black transition-all duration-300
          ${isBusy ? "opacity-100" : "opacity-0"}
        `}
      />

      <Outlet />
    </div>
  );
}