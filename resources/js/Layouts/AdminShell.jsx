import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminShell({ title, children }) {
  const { auth } = usePage().props;

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={route('home.index')} className="font-semibold">Pureat</Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href={route('admin.seasonings.index')} className="hover:underline">
                調味料
              </Link>
            </nav>
          </div>
          <div className="text-sm">
            {auth?.user?.name}（管理）
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {title && <h1 className="text-lg font-semibold mb-4">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
