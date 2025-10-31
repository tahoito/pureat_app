import React, { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClock, faSliders } from "@fortawesome/free-solid-svg-icons";
// SeasoningCard is unused here (list UI is commented out). Remove import to avoid build warnings.
import Modal from "@/Components/Modal";

const GENRES = [
  { key: "soy sauce", label: "醤油" },
  { key: "miso", label: "味噌" },
  { key: "salt", label: "塩" },
  { key: "vinegar", label: "酢" },
  { key: "sweetener", label: "甘味料" },
  { key: "oil", label: "油" },
]

/* ---------------- Page ---------------- */
export default function SeasoningsIndex() {
  const { items, filters } = usePage().props;
  const [ q, setQ ] = useState(filters.q || "");
  const [ genre, setGenre ] = useState(filters.genre || "");
  const [ sort, setSort ] = useState(filters.sort || "name_asc");
  const [ safety, setSafety ] = useState(filters.safety || "all");

  const [ openSheet, setOpenSheet ] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => {
  router.get(route("seasonings.index"), 
      { q, genre, sort, safety }, 
      { preserveState: true, replace: true });
    }, 450);
    return () => clearTimeout(t);
  }, [q, genre, sort, safety]);

  const handleChip = (type) =>  {
    if (type === "all") { setGenre(""); setSafety(""); setSort("popular"); return; }
    if (type === "safe") { setSafety(safety === "safe" ? "" : "safe"); return;}
    if (type === "popular") { setSort("popular"); return; }
    if (type === "cheap") { setSort(sort === "price" ? "popular": "price"); return;}
  }

  return (
    <AppShell title="調味料検索">
      <Head title="調味料検索" />

      <div className="p-6 space-y-6">
        {/* 検索 */}
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            router.get(
              route("seasonings.index"),
              { ...filters, q: q || undefined },
              { preserveState: true, replace: true }
            );
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full h-12 pl-4 pr-10 rounded-full border border-main/40 outline-none bg-white"
            placeholder="調味料名・原材料名で検索"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
            aria-label="検索"
          >
            <FontAwesomeIcon icon={faSearch} className="text-main" />
          </button>
          <button
            onClick={() => setOpenSheet(true)}
            aria-label="絞り込みを開く"
            className="p-2 rounded-full border text-main/80 border-main/30"
          >
            <FontAwesomeIcon icon={faSliders} />
          </button>
        </form>

        <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto">
          <button onClick={() => handleChip("all")
            } className={`px-3 h-8 rounded-full border text-sm border ${
              !genre && !safety && sort === "popular"
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-white border-main/30 hover:bg-base"
            }`}
          >
            全て
          </button>
          <button onClick={() => handleChip("safe")}
            className={`px-3 h-8 rounded-full border text-sm border ${
              safety === "safe"
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-white border-main/30 hover:bg-base"
            }`}>安全
            </button>

          <button onClick={() => handleChip("popular")}
            className={`px-3 h-8 rounded-full border text-sm border ${
              sort === "popular"
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-white border-main/30 hover:bg-base"
            }`}>人気
            </button>
          <button onClick={() => handleChip("cheap")}
            className={`px-3 h-8 rounded-full border text-sm border ${
              sort === "price"
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-white border-main/30 hover:bg-base"
            }`}>安い順
            </button>
        </div>

        <Modal show={openSheet} onClose={() => setOpenSheet(false)}>
          <div className="px-4 py-3 border-b">
            <h3 className="text-base font-medium text-gray-800">ジャンル・絞り込み</h3>
          </div>
        {/* ジャンル */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">ベース調味料</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <button key={g.key}
                  onClick={() => setGenre(genre === g.key ? "" : g.key)}
                  className={`px-3 py-1 rounded-full text-sm border transition
                    ${genre===g.key ? "bg-[#C7D7B3] border-[#9EB18E]" : "bg-white border-gray-300"}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
            {/* 安全度 */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">安全度</p>
            <div className="flex gap-2">
              {[
                {k:"safe", l:"4毒フリー"},
                {k:"caution", l:"要注意（甘味料/添加）"},
                {k:"ng", l:"NG（小麦/乳含む）"},
              ].map(s=>(
                <button key={s.k}
                  onClick={()=> setSafety(safety===s.k ? "" : s.k)}
                  className={`px-3 py-1 rounded-full text-sm border
                    ${safety===s.k ? "bg-[#FFEAD1] border-amber-300" : "bg-white border-gray-300"}`}>
                  {s.l}
                </button>
              ))}
            </div>
          </div>

          {/* 並び替え */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">並び替え</p>
            <div className="flex gap-2">
              {[
                {k:"popular", l:"人気順"},
                {k:"updated", l:"新着順"},
                {k:"name", l:"名前順"},
                {k:"price", l:"価格順"},
              ].map(o=>(
                <button key={o.k}
                  onClick={()=> setSort(o.k)}
                  className={`px-3 py-1 rounded-full text-sm border
                    ${sort===o.k ? "bg-[#E6EEE0] border-[#B9C9AB]" : "bg-white border-gray-300"}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          {/* アクション */}
          <div className="flex gap-2">
            <button
              onClick={() => { setGenre(""); setSafety(""); setSort("popular"); }}
              className="flex-1 py-2 rounded-lg border text-gray-700"
            >リセット</button>
            <button
              onClick={() => setOpenSheet(false)}
              className="flex-1 py-2 rounded-lg bg-[#71896E] text-white"
            >この条件で見る</button>
          </div>
  </Modal>

        </div>
    </AppShell>
  );
}
