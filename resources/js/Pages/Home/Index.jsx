import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch,faClock } from "@fortawesome/free-solid-svg-icons";

function RecipeCard({ r, highlight }) {
  const img = r.main_image ?? r.main_image_path;
  const hasMinutes = typeof r.total_minutes === "number" && !Number.isNaN(r.total_minutes)
    ? r.total_minutes : null;
  const firstTag = Array.isArray(r.tags) && r.tags.length > 0 ? r.tags[0] : null ;
  return (
    <article
      className={`rounded-lg overflow-hidden border bg-white ${
        Number(highlight) === r.id ? "ring-2 ring-amber-400" : ""
      }`}
    >
      <Link href={typeof route === "function" ? route("recipes.show", r.id) : `/recipes/${r.id}`} className="block">
        {/* ← 両方おなじ高さに統一 */}
        <img src={img} alt={r.title} className="w-full h-24 object-cover" />
        <div className="p-2 space-y-1">
          <p className="text-sm font-medium line-clamp-1">{r.title}</p>
          {hasMinutes && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FontAwesomeIcon icon={faClock} className="text-[11px]"/>
              <span>{ r.total_minutes}分</span>
            </div>
          )}

          {firstTag && (
            <span className="inline-block px-2 py-0.5 rounded-full border border^main/20 bg-white text-gray-600 text-[11px]">
              #{firstTag.name}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}

export default function HomeIndex() {
  const { categories = [], tags = [], recipes = { data: [] }, tab = "all", highlight } = usePage().props;

  const Tab = ({ to, active, children }) => (
    <Link
      href={to}
      preserveScroll
      className={`inline-flex items-center justify-center
        h-6 px-2.5 rounded-full border text-xs
        ${active ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-600"}`}
      aria-selected={active}
      role="tab"
    >
      {children}
    </Link>
  );

  return (
    <AppShell title="ホーム">
      <Head title="ホーム" />

      <div className="p-6 space-y-6">
        {/* 検索 */}
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className="w-full h-12 pl-12 pr-4 rounded-full border-main/40 outline-none bg-white"
            placeholder="材料や料理名で検索"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
            aria-label="検索"
          >
            <FontAwesomeIcon icon={faSearch} className="text-main" />
          </button>
        </form>

        {/* カテゴリー */}
        <section>
          <h2 className="text-lg mb-2 text-text">カテゴリー</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0, 9).map((c) => (
              <Link
                key={c.name}
                href={`/recipes?category=${encodeURIComponent(c.name)}`} // ← テンプレでOK
                className="relative h-16 rounded-xl border border-main/30 overflow-hidden group"
              >
                <img
                  src={c.image_url}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute left-2 bottom-2 z-10 text-white text-xs font-semibold drop-shadow">
                  {c.icon}
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* タグ */}
        <section>
          <h2 className="text-lg mb-2 text-text">タグ</h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tags.map((t) => (
              <Link
                key={t.slug}
                href={`/recipes?tag=${encodeURIComponent(t.name)}`}
                className="shrink-0 px-3 h-9 rounded-full border border-main/30 bg-white text-sm flex items-center hover:bg-base"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        </section>

        {/* レシピ（おすすめ|すべて タブ） */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg mb-2 text-text">レシピ</h2>
            <div className="flex gap-2 text-sm">
              <Tab
                to={typeof route === "function" ? route("explore", { tab: "recommended" }) : "/?tab=recommended"}
                active={tab === "recommended"}
              >
                おすすめ
              </Tab>
              <Tab to={typeof route === "function" ? route("explore", { tab: "all" }) : "/?tab=all"} active={tab === "all"}>
                すべて
              </Tab>
            </div>
          </div>

          {(!recipes || !recipes.data || recipes.data.length === 0) ? (
            <p className="text-sm text-gray-500">まだレシピが追加されてありません</p>
          ) : tab === "recommended" ? (
            /* おすすめ：横スクロール（カードは“すべて”と完全一致） */
            <div
              className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-6 px-6 py-1"
              role="list"
              aria-label="おすすめレシピ"
            >
              {recipes.data.map((r) => (
                <div
                  key={r.id}
                  role="listitem"
                  className="shrink-0 snap-start"
                  /* グリッド2列の1カラム幅に合わせる → gap-3(0.75rem)の半分を引く */
                  style={{ width: "calc(50% - 0.375rem)" }}
                >
                  <RecipeCard r={r} highlight={highlight} />
                </div>
              ))}
            </div>
          ) : (
            /* すべて：縦グリッド（2列） */
            <>
              <div className="grid grid-cols-2 gap-3">
                {recipes.data.map((r) => (
                  <RecipeCard key={r.id} r={r} highlight={highlight} />
                ))}
              </div>

              {recipes.next_page_url && (
                <div className="mt-2">
                  <Link
                    href={recipes.next_page_url}
                    preserveScroll
                    preserveState
                    className="block text-center text-sm text-amber-600"
                  >
                    もっと見る
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
