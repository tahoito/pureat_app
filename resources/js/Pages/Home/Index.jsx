import React, { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClock } from "@fortawesome/free-solid-svg-icons";

/* ---------------- RecipeCard ---------------- */
function RecipeCard({ r, highlight }) {
  const img =
    r.main_image_url ??
    (r.main_image_path ? `/storage/${r.main_image_path}` : null) ??
    r.main_image ??
    "/images/placeholder.jpeg";

  const hasMinutes =
    typeof r.total_minutes === "number" && !Number.isNaN(r.total_minutes)
      ? r.total_minutes
      : null;
  const firstTag =
    Array.isArray(r.tags) && r.tags.length > 0 ? r.tags[0] : null;

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

/* ---------------- Debounce hook ---------------- */
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

function resolveCategoryLabel(val, categories) {
  if (!val) return null;
  const s = String(val);
  const hit = categories.find(
    (c) => String(c.id) === s || c.slug === s
  );
  return hit?.name ?? s;
}
function resolveTagLabel(val, tags) {
  if (!val) return null;
  const s = String(val);
  const hit = tags.find(
    (t) => String(t.id) === s || t.slug === s
  );
  return hit?.name ?? s;
}

/* ---------------- Page ---------------- */
export default function HomeIndex() {
  const {
    categories = [],
    tags = [],
    recipes = { data: [] },
    tab = "all",
    filters = {},
    recommended = [],
    highlight,
  } = usePage().props;

  const [q, setQ] = useState(filters?.q ?? "");
  const debouncedQ = useDebounce(q, 300);

  const activeCategory = filters?.category ?? null;
  const activeTag = filters?.tag ?? null;

  const hasFilter = !!(filters?.q || filters?.tag || filters?.category);
  const useRecommended = !hasFilter && tab === "recommended";
  const list = useRecommended ? recommended : recipes.data ?? [];

  const Tab = ({ to, active, children }) => (
    <Link
      href={to}
      preserveScroll
      className={`inline-flex items-center justify-center
        h-6 px-2.5 rounded-full border text-xs
        ${
          active
            ? "bg-amber-500 text-white border-amber-500"
            : "bg-white text-gray-600"
        }`}
      aria-selected={active}
      role="tab"
    >
      {children}
    </Link>
  );

  // 検索のデバウンス
  useEffect(() => {
    if ((filters?.q ?? "") === debouncedQ) return;
    router.get(
      route("home.index"),
      { ...filters, q: debouncedQ || undefined },
      { preserveState: true, preserveScroll: true, replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  // フィルタ解除
  function clearFilter(key) {
    const next = { ...filters, [key]: undefined };
    router.get(route("home.index"), next, {
      preserveState: true,
      replace: true,
      preserveScroll: true,
    });
  }

  return (
    <AppShell title="ホーム">
      <Head title="ホーム" />

      <div className="p-6 space-y-6">
        {/* 検索 */}
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            router.get(
              route("home.index"),
              { ...filters, q: q || undefined },
              { preserveState: true, replace: true }
            );
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full h-12 pl-4 pr-10 rounded-full border border-main/40 outline-none bg-white"
            placeholder="材料や料理名で検索"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
            aria-label="検索"
          >
            <FontAwesomeIcon icon={faSearch} className="text-main" />
          </button>
        </form>

        {/* 現在のフィルタ（チップ） */}
        {hasFilter && (
          <div className="flex flex-wrap gap-2">
            {filters.q && (
              <button
                onClick={() => clearFilter("q")}
                className="px-3 h-8 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-sm"
              >
                検索: {filters.q} ×
              </button>
            )}
            {filters.category && (
              <button
                onClick={() => clearFilter("category")}
                className="px-3 h-8 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-sm"
              >
                カテゴリー:{" "}
                {resolveCategoryLabel(filters.category, categories)} ×
              </button>
            )}
            {filters.tag && (
              <button
                onClick={() => clearFilter("tag")}
                className="px-3 h-8 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-sm"
              >
                タグ: {resolveTagLabel(filters.tag, tags)} ×
              </button>
            )}
          </div>
        )}

        {/* カテゴリー */}
        <section>
          <h2 className="text-lg mb-2 text-text">カテゴリー</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0, 9).map((c) => {
              const key = c.slug ?? c.id;
              const active = activeCategory === key;
              return (
                <Link
                  key={c.id}
                  href={route("home.index", {
                    ...filters,
                    q: filters.q ?? undefined,
                    category: key,
                    tab: "all",
                  })}
                  preserveScroll
                  className={`relative h-16 rounded-xl overflow-hidden group border
                    ${
                      active
                        ? "ring-2 ring-amber-400 border-amber-400"
                        : "border-main/30 hover:border-main/50"
                    }`}
                  aria-pressed={active}
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
              );
            })}
          </div>
        </section>

        {/* タグ */}
        <section>
          <h2 className="text-lg mb-2 text-text">タグ</h2>
          <div className="flex flex-wrap gap-1">
            {tags.map((t) => {
              const key = t.slug ?? t.id;
              const active = activeTag === key;
              return (
                <Link
                  key={key}
                  href={route("home.index", {
                    ...filters,
                    q: filters.q ?? undefined,
                    tag: key,
                    tab: "all",
                  })}
                  preserveScroll
                  className={`px-2.5 h-8 rounded-full border text-sm flex items-center
                    ${
                      active
                        ? "bg-amber-50 border-amber-300 text-amber-700"
                        : "bg-white border-main/30 hover:bg-base"
                    }`}
                >
                  #{t.name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* レシピ（おすすめ | すべて） */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-lg mb-2 text-text">レシピ</h2>
          <div className="flex gap-2 text-sm">
            <Tab
              to={route("home.index", { ...filters, tab: "recommended" })}
              active={tab === "recommended"}
            >
              おすすめ
            </Tab>
            <Tab
              to={route("home.index", { ...filters, tab: "all" })}
              active={tab === "all"}
            >
              すべて
            </Tab>
          </div>
        </div>

        <div className="pt-4">
          {!list.length ? (
            <p className="text-sm text-gray-500">該当レシピがないよ</p>
          ) : useRecommended ? (
            <div className="grid grid-cols-2 gap-3">
              {list.map((r) => (
                <RecipeCard key={`rec-${r.id}`} r={r} highlight={highlight} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {list.map((r) => (
                  <RecipeCard
                    key={`recipe-${r.id}`}
                    r={r}
                    highlight={highlight}
                  />
                ))}
              </div>
              {!useRecommended && recipes.next_page_url && (
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
        </div>
      </div>
    </AppShell>
  );
}
