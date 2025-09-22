import React from "react";
import { Head, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function ShoppingList({ items = [] }) {
  return (
    <AppShell title="買い物リスト">
      <Head title="買い物リスト" />

      {/* 固定ヘッダー */}
      <header
        className="fixed top-0 left-0 right-0 z-30 bg-main/90 text-white backdrop-blur h-12"
        role="banner"
      >
        {/* gridで左/中/右を確保 → 中央が常に真ん中 */}
        <div className="h-full px-3 grid grid-cols-3 items-center">
          {/* 左：戻る */}
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                router.visit(route("history.index"), { preserveScroll: true });
              }
            }}
            className="justify-self-start p-2 -ml-2"
            aria-label="戻る"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl text-base" />
          </button>

         
          <h1 className="justify-self-center text-lg font-medium">買い物リスト</h1>

            <button 
                type="button"
                onClick={() => router.delete(route("shopping-list.clear"))}
                className="text-sm underline decoration-white/60"
            >リセット
            </button>
        </div>
      </header>


      <div className="pt-16 p-4 pb-[calc(64px+env(safe-area-inset-bottom))] space-y-4">
        {items.length === 0 && (
          <p className="text-gray-500 text-sm">まだリストには何もありません</p>
        )}

        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 border rounded px-3 py-2 bg-white"
            >
              <input
                type="checkbox"
                checked={!!item.checked}              
                onChange={() =>
                  router.put(route("shopping-list.toggle", item.id), {}, { preserveScroll: true })
                }
              />
              <span className={item.checked ? "line-through text-gray-400" : ""}>
                {item.name}{item.quantity > 1 && `×${item.quantity}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
