import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons"; // ← 追加

export default function AddPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <AppShell title="追加する" active="add">
      <Head title="レシピを追加" />

      {/* ヘッダー */}
      <header className="sticky top-0 z-30 bg-main/95 backdrop-blur border-b">
        <div className="h-12 px-3 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2" aria-label="閉じる">
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </Link>

          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-base text-lg font-bold active:opacity-90"
          >
            追加
          </button>
        </div>
      </header>

      {/* ★ 一番上の写真エリア */}
      <section className="rounded-2xl overflow-hidden bg-gray-100">
        <label htmlFor="main-image" className="block cursor-pointer" title="画像を選択">
          <div className="relative w-full aspect-[4/3] bg-gray-100">
            {preview ? (
              <img src={preview} alt="プレビュー" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                ここをタップして写真を追加
              </div>
            )}
            <span className="absolute top-2 right-2 text-xs bg-white/90 backdrop-blur px-2 py-1 rounded-lg border">
              {preview ? "変更" : "追加"}
            </span>
          </div>
        </label>
        <input
          id="main-image"
          type="file"
          accept="image/*"
          // スマホで背面カメラ起動（対応端末のみ）
          capture="environment" // ← コメントはこの形式で
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />
      </section>

      <div className="p-4 pb-28 space-y-5 bg-white rounded-xl">
        {/* 基本情報 */}
        <section className="p-4 space-y-3">
          <div>
            <label className="block text-lg text-text text-center">料理名</label>
            <input className="mt-1 w-full rounded-lg border p-2" placeholder="和風パスタ" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600">人数</label>
              <input type="number" min="1" className="mt-1 w-full rounded-lg border p-2" placeholder="2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">調理時間(分)</label>
              <input type="number" min="0" className="mt-1 w-full rounded-lg border p-2" placeholder="15" />
            </div>
          </div>
        </section>

        {/* 材料 */}
        <section className="p-4 space-y-3">
          <div className="flex justify-center">
            <label className="block w-full text-lg text-text text-center">材料</label>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_88px] gap-2">
              <input className="rounded-lg border p-2" placeholder="例：スパゲッティ" />
              <input className="rounded-lg border p-2" placeholder="100g" />
            </div>
            <div className="grid grid-cols-[1fr_88px] gap-2">
              <input className="rounded-lg border p-2" placeholder="例：醤油" />
              <input className="rounded-lg border p-2" placeholder="大さじ1" />
            </div>
          </div>

          <div className="flex justify-center">
            <button type="button" className="text-amber-600 text-sm">＋行を追加</button>
          </div>
        </section>

        {/* 作り方 */}
        <section className="p-4 space-y-3">
          <div className="flex justify-center">{/* ← 修正：items-center-between を削除 */}
            <label className="block w-full text-lg text-text text-center">作り方</label>
          </div>

          <ol className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-2 w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">1</span>
              <textarea rows={2} className="flex-1 rounded-lg border p-2" placeholder="例：パスタを茹でる"></textarea>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">2</span>
              <textarea rows={2} className="flex-1 rounded-lg border p-2" placeholder="例：ソースを作る"></textarea>
            </li>
          </ol>

          <div className="flex justify-center">
            <button type="button" className="text-amber-600 text-sm">+ 手順を追加</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
