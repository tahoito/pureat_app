import React from "react";
import { Head, usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCartPlus, faListCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function SeasoningsShow() {
  const { item } = usePage().props;
  if (!item) return <div>読み込み中...</div>;

  const goBack = React.useCallback(() => {
    window.history.back();
  }, []);

  // 画像URLの生成
  const resolveImg = (path) => {
    if (!path) return "/images/placeholder.jpeg";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/storage/")) return path;
    return `/storage/${path.replace(/^\/?storage\//, "")}`;
  };

  const img = resolveImg(item.image_path || item.image_url);

  // 買い物リスト追加ボタン
  function AddToShoppingButton({ seasoningId }) {
    const KEY = `shopping:addedUntil:${seasoningId}`;
    const [adding, setAdding] = React.useState(false);
    const [added, setAdded] = React.useState(false);

    React.useEffect(() => {
      try {
        const until = Number(localStorage.getItem(KEY) || 0);
        if (until && Date.now() < until) setAdded(true);
      } catch {}
    }, [KEY]);

    const handleAdd = async () => {
      if (adding || added) return;
      setAdding(true);
      try {
        // ★ API 側で seasoning_id を受け取るようにしてね
        await axios.post(route("shopping-list.add"), { seasoning_id: seasoningId });

        const EXPIRE_MS = 12 * 60 * 60 * 1000; // 12時間
        localStorage.setItem(KEY, String(Date.now() + EXPIRE_MS));
        setAdded(true);
      } catch (e) {
        console.error(e);
        setAdded(false);
      } finally {
        setAdding(false);
      }
    };

    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={adding || added}
        className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full 
          text-xs font-medium whitespace-nowrap shadow-sm transition
          ${
            added
              ? "bg-accent2 text-white border border-accent2"
              : "bg-accent2 text-white hover:bg-accent2/90 active:scale-[0.98]"
          }
          disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <FontAwesomeIcon
          icon={added ? faListCheck : faCartPlus}
          className="text-[13px]"
        />
        {added ? "追加済み" : adding ? "追加中..." : "リストに追加"}
      </button>
    );
  }

  return (
    <AppShell title={item.name} active="">
      <Head title={item.name} />

      {/* 上の固定ヘッダー */}
      <header
        className="fixed top-0 left-0 right-0 z-30 
          bg-main/90 text-white backdrop-blur h-12"
      >
        <div className="h-full px-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="p-2 -ml-2"
            aria-label="戻る"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
        </div>
      </header>

      <main className="pt-14 pb-28 bg-[#F5F5F5] min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          {/* 画像 + 情報（左右） */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* 左：画像 */}
            <div className="md:w-1/2 w-full aspect-square bg-gray-100 rounded-md overflow-hidden">
              <img
                src={img}
                alt={item.name}
                className="w-full h-full object-contain p-3"
              />
            </div>

            {/* 右：テキスト情報 */}
            <div className="md:w-1/2 w-full bg-white border border-main/10 rounded-md p-5 shadow-sm mt-4 md:mt-0">
              <h1 className="text-2xl font-bold tracking-wide text-gray-800 mb-3">
                {item.name}
              </h1>

              {item.brand && (
                <p className="text-sm text-gray-500 mb-1">
                  ブランド：{item.brand}
                </p>
              )}
              {item.genre && (
                <p className="text-sm text-gray-500 mb-1">
                  ジャンル：{item.genre}
                </p>
              )}
              {item.price && (
                <p className="text-sm text-gray-600 mb-1">
                  価格：{item.price}円
                  {item.quantity && item.quantity_unit && (
                    <> / {item.quantity}{item.quantity_unit}</>
                  )}
                </p>
              )}

              {item.shop_url && (
                <p className="mt-2 text-sm text-gray-600">
                  通販サイトは{" "}
                  <a
                    href={item.shop_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-main underline underline-offset-4 decoration-2"
                  >
                    こちら
                  </a>
                </p>
              )}

              <div className="mt-4">
                <AddToShoppingButton seasoningId={item.id} />
              </div>
            </div>
          </div>

          {/* 商品説明の大きいボックス */}
          <div className="mt-10">
            <div className="w-full rounded-xl border border-main/40 bg-white px-6 py-4 text-center text-sm text-gray-700">
              {item.description || "商品について簡単に説明"}
            </div>
          </div>

          {/* 成分・原材料一覧 */}
          <section className="mt-10">
            <h2 className="text-center text-lg font-semibold text-gray-800">
              成分・原材料一覧
            </h2>
            <div className="mt-4 rounded-xl bg-white border px-4 py-3">
              {item.ingredients_text ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 whitespace-pre-line">
                  {item.ingredients_text
                    .split(/[、,]\s*/).filter(Boolean)
                    .map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  成分・原材料はまだ登録されていません。
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
