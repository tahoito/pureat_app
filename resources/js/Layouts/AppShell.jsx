import React from "react";
import BottomNav from "@/Components/BottomNav";

export default function AppShell({ title, children }) {
  return (
    <div className="min-h-svh flex flex-col bg-base text-text">
      
      {/* メイン。下ナビの分だけ余白を足して被らないようにする */}
      <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom))]">
        {children}
      </main>

      {/* 共通ボトムナビ */}
      <BottomNav />
    </div>
  );
}
