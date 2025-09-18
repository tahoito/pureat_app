// resources/js/Pages/Favorites/Index.jsx
import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClock } from "@fortawesome/free-solid-svg-icons";

// --- Homeと同じ見た目のカード ---
function resolveImg(raw){
    if(!raw) return "/images/placeholder.jpeg"
    if (typeof raw !== "string") return "/images/placeholder.jpeg";
    if (/^https?:\/\//.test(raw) || raw.startsWith("/")) return raw;
    return `/storage/${raw.replace(/^\/?storage\//, "")}`;
}

function RecipeCard({ r, highlight }) {
  const item = r?.recipe ?? r;
  const img = resolveImg(
    item?.main_image_url ?? item?.main_image ?? item?.main_image_path
  );
  const hasMinutes =
    typeof item?.total_minutes === "number" && !Number.isNaN(item.total_minutes)
      ? item.total_minutes
      : null;
  const firstTag = Array.isArray(item?.tags) && item.tags.length > 0 ? item.tags[0] : null;

  return (
    <article
      className={`rounded-lg overflow-hidden border bg-white ${
        Number(highlight) === (item?.id ?? r?.id) ? "ring-2 ring-amber-400" : ""
      }`}
    >
      <Link
        href={route("recipes.show", item.id)}
        className="block"
      >
        {/* 同じ高さに統一 */}
        <img src={img} alt={item?.title ?? ""} className="w-full h-24 object-cover" />
        <div className="p-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium line-clamp-1">{item?.title}</p>
            {hasMinutes && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FontAwesomeIcon icon={faClock} className="text-[11px]" />
                <span>{hasMinutes}分</span>
              </div>
            )}
          </div>

          {firstTag && (
            <span className="inline-block px-2 py-0.5 rounded-full border border-main/20 bg-white text-gray-600 text-[11px]">
              #{firstTag.name}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}

export default function FavoritesIndex() {
  const { recipes = { data: [], links: [] }, highlight } = usePage().props;

  return (
    <AppShell title="お気に入り" active="favorites">
      <Head title="お気に入り" />

      {/* 固定ヘッダー */}
      <header
        className="fixed top-0 left-0 right-0 z-30 bg-main/90 text-white backdrop-blur h-12"
        role="banner"
      >
        <div className="h-full px-3 flex items-center justify-between">
          <Link
            href={typeof route === "function" ? route("home.index") : "/"}
            className="p-2 -ml-2"
            aria-label="戻る"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl text-base" />
          </Link>
          <h1 className="text-lg font-medium">お気に入り</h1>
          <span className="w-8" />{/* 右の余白バランス用 */}
        </div>
      </header>

      {/* ヘッダー分の余白 */}
      <div className="pt-16 p-4">
        {recipes.data.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-16">お気に入りはまだないよ</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {recipes.data.map((r) => (
                <RecipeCard key={r.id} r={r} highlight={highlight} />
              ))}
            </div>

          </>
        )}
      </div>
    </AppShell>
  );
}
