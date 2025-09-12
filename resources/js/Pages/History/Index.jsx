import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClock } from "@fortawesome/free-solid-svg-icons";

function RecipeCard({ r }) {
    const img =
        r.main_image_url ?? r.main_image ?? r.main_image_path ?? "/images/placeholder.png";
    const hasMinutes =
        typeof r.total_minutes === "number" && !Number.isNaN(r.total_minutes)
        ? r.total_minutes
        : null;
    const firstTag = Array.isArray(r.tags) && r.tags.length > 0 ? r.tags[0] : null;

    return (
        <article className="rounded-lg overflow-hidden border bg-white">
        <Link href={route("recipes.show", r.id)} className="block">
            <img src={img} alt={r.title} className="w-full h-24 object-cover" />
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
            {r.viewed_at && (
                <p className="mt-1 text-[11px] text-gray-400">閲覧: {r.viewed_at}</p>
            )}
            </div>
        </Link>
        </article>
    );
    }

    export default function HistoryIndex() {
    const { recipes = { data: [], links: [] } } = usePage().props;

    return (
        <AppShell title="閲覧履歴" active="history">
        <Head title="閲覧履歴" />

        {/* ヘッダー */}
        <header
            className="fixed top-0 left-0 right-0 z-30 bg-main/90 text-white backdrop-blur h-12"
            role="banner"
        >
            <div className="h-full px-3 flex items-center justify-between">
            <Link
                href={route("home.index")}
                className="p-2 -ml-2"
                aria-label="戻る"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-xl text-base" />
            </Link>
            <h1 className="text-lg font-medium">閲覧履歴</h1>

            {/* 全消し */}
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

        {/* コンテンツ */}
        <div className="pt-16 p-4">
            {recipes.data.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-16">
                まだ履歴はないよ
            </p>
            ) : (
            <>
                <div className="grid grid-cols-2 gap-3">
                {recipes.data.map((r) => (
                    <RecipeCard key={r.id} r={r} />
                ))}
                </div>
            </>
            )}
        </div>
        </AppShell>
    );
}