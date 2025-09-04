import React from "react";
import { Head } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";

export default function AddPage() {
  return (
    <AppShell title="追加する" active="add"> 
      <Head title="レシピを追加" />
      <div className="p-4 space-y-4">
        <h1 className="text-lg font-semibold">レシピを追加</h1>
      </div>
    </AppShell>
  );
}
