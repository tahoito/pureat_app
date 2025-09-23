import React from "react";
import BottomNav from "@/Components/BottomNav";

export default function AppShell({ title, children }) {
  return (
    <div
      className="
        flex flex-col h-screen
        bg-base text-text
      "
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <main
        className="
          flex-1 overflow-y-auto
          pb-[calc(64px+env(safe-area-inset-bottom))]
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
