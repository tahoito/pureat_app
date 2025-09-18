import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClock } from "@fortawesome/free-solid-svg-icons";


function startOfDay(x) {
  const d = new Date(x);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function diffDays(a, b) {
  return Math.round((startOfDay(a) - startOfDay(b)) / 86400000);
}
function toDateKey(dt) {
  const d = new Date(dt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function dateLabel(dt) {
  const d = new Date(dt);
  const today = new Date();
  const dDays = diffDays(today, d);

  if (dDays === 0) return "今日";
  if (dDays === 1) return "昨日";

  const day = today.getDay();
  const offsetToMonday = (day + 6) % 7;
  const startThisWeek = startOfDay(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - offsetToMonday)
  );
  const startLastWeek = new Date(startThisWeek);
  startLastWeek.setDate(startThisWeek.getDate() - 7);

  if (d >= startThisWeek) return "今週";
  if (d >= startLastWeek && d < startThisWeek) return "先週";

  const w = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}/${d.getDate()}(${w[d.getDay()]})`;
}


function sanitizeSrc(u) {
  if (!u) return "/images/placeholder.jpeg";
  u = String(u);

  // /storage/http://... → http://...
  u = u.replace(/^\/storage\/(https?:\/\/)/, "$1");
  // /storage/storage/... → /storage/...
  u = u.replace(/\/storage\/storage\//g, "/storage/");
  u = u.replace(/^\/storage\/images\//, "/images/");
  // 先頭が "storage/" の相対 → /storage/...
  if (u.startsWith("storage/")) u = "/" + u;

  // それ以外は storage 配下だとみなす
  return u;
}


function RecipeCard({ r }) {
  const item = r.recipe ?? r;
  const img = sanitizeSrc(
    item?.main_image_url ?? item?.main_image ?? item?.main_image_path ?? null
  );

  const hasMinutes =
    typeof item.total_minutes === "number" && !Number.isNaN(item.total_minutes)
      ? item.total_minutes
      : null;

  const firstTag =
    Array.isArray(item.tags) && item.tags.length > 0 ? item.tags[0] : null;

  return (
    <article className="rounded-lg overflow-hidden border bg-white">
      <Link href={route("recipes.show", item.id)} className="block">
        <div className="relative">
          <img
            src={img}
            alt={item.title}
            className="w-full h-24 object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.jpeg";
            }}
          />
        </div>
        <div className="p-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium line-clamp-1">{item.title}</p>
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


export default function HistoryIndex() {
  const { recipes = { data: [], links: [] } } = usePage().props;

  const groups = React.useMemo(() => {
    const byDate = {};
    for (const r of recipes.data) {
      const when =
        r.viewed_at ?? r.updated_at ?? r.created_at ?? new Date().toISOString();
      const key = toDateKey(when);
      (byDate[key] ||= []).push(r);
    }

    const sortedKeys = Object.keys(byDate).sort((a, b) => (a < b ? 1 : -1));

    for (const k of sortedKeys) {
      byDate[k].sort((a, b) => {
        const aa = new Date(a.viewed_at ?? a.updated_at ?? a.created_at ?? 0).getTime();
        const bb = new Date(b.viewed_at ?? b.updated_at ?? b.created_at ?? 0).getTime();
        return bb - aa;
      });
    }

    return sortedKeys.map((key) => ({
      key,
      label: dateLabel(key),
      items: byDate[key],
    }));
  }, [recipes.data]);

  return (
    <AppShell title="閲覧履歴" active="history">
      <Head title="閲覧履歴" />

      <header
        className="fixed top-0 left-0 right-0 z-30 bg-main/90 text-white backdrop-blur h-12"
        role="banner"
      >
        <div className="h-full px-3 flex items-center justify-between">
          <Link href={route("home.index")} className="p-2 -ml-2" aria-label="戻る">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl text-base" />
          </Link>
          <h1 className="text-lg font-medium">閲覧履歴</h1>

          <button
            type="button"
            className="text-sm underline decoration-white/60"
            onClick={() =>
              router.delete(route("history.clear"), {
                preserveScroll: true,
              })
            }
          >
            全消し
          </button>
        </div>
      </header>

      <div className="pt-16 p-4">
        {recipes.data.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-16">まだ履歴はないよ</p>
        ) : (
          <div className="space-y-6">
            {groups.map((section) => (
              <section key={section.key} className="space-y-4">
                <div className="flex items-center">
                  <h2 className="text-xs font-semibold text-text tracking-wide mr-3 pl-2">
                    {section.label}
                  </h2>
                  <hr className="flex-1 border-t border-main/40" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {section.items.map((r, idx) => {
                    // ← 重複キー対策：レシピID + 日時（なければ idx）
                    const rid = r.recipe?.id ?? r.id;
                    const when =
                      r.viewed_at ?? r.updated_at ?? r.created_at ?? `idx${idx}`;
                    const ukey = `${rid}-${when}`;
                    return <RecipeCard key={r.history_id ?? ukey} r={r} />;
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
