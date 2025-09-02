import React from "react";
import BottomNav from "@/Components/BottomNav";

export default function AppShell({ title, children }) {
  return (
    <div className="fixed inset-0 bg-base text-text">
      
      {/* メイン。下ナビの分だけ余白を足して被らないようにする */}
      <main className="flex-1 overflow-y-auto pb-[80px]">
        {children}
      </main>

      {/* 共通ボトムナビ */}
      <BottomNav />
    </div>
  );
}
