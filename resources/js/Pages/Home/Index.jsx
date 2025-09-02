import React from "react";
import { Head } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";


export default function HomeIndex() {
  return (
    <AppShell title="ホーム">
      <Head title="ホーム" />
      {/* ここにホームの中身 */}
    </AppShell>
  );
}
