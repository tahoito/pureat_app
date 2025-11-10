// resources/js/Pages/Favorites/Index.jsx
import React from "react";
import { Head, Link, usePage, router} from "@inertiajs/react";
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
  // HomeのRecipeCardと同じロジック
  const img =
    r.main_image_url ??
    (r.main_image_path ? `/storage/${r.main_image_path}` : null) ??
    r.main_image ??
    "/images/placeholder.jpeg";

  const hasMinutes =
    typeof r.total_minutes === "number" && !Number.isNaN(r.total_minutes)
      ? r.total_minutes
      : null;

  return (
    <article
      className={`rounded-lg overflow-hidden border bg-white ${
        Number(highlight) === r.id ? "ring-2 ring-amber-400" : ""
      }`}
    >
      <Link href={route("recipes.show", r.id)} className="block">
        <img
          src={img}
          alt={r.title}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="p-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium line-clamp-1">{r.title}</p>
            {hasMinutes && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FontAwesomeIcon icon={faClock} className="text-[11px]" />
                <span>{hasMinutes}分</span>
              </div>
            )}
          </div>
          {Array.isArray(r.tags) && r.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {r.tags.slice(0, 2).map((t) => (
                <span
                  key={t.id}
                  className="inline-block px-2 py-0.5 rounded-full border border-main/20 bg-white text-gray-600 text-[11px]"
                >
                  #{t.name}
                </span>
              ))}
            </div>
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
          <button
            type="button"
            onClick={() => {
                if(window.history.length > 1 ){
                    window.history.back();
                }else {
                    router.visit(route("favorites.index"),{ preserveScroll : true });
                }
            }}
            className="p-2 -ml-2"
            aria-label="戻る"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl text-base" />
          </button>
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
