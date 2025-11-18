import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AdminShell from "@/Layouts/AdminShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function AdminSeasoningsIndex() {
  const { items, filters, genres } = usePage().props;
  const [q, setQ] = React.useState(filters.q || "");
  const [genre, setGenre] = React.useState(filters.genre || "");
  const [sort, setSort] = React.useState(filters.sort || "updated");

  const submit = (e) => {
    e?.preventDefault();
    router.get(route("admin.seasonings.index"), { q, genre, sort }, { preserveState: true, replace: true });
  };

  const handleDelete = (id) => {
    if (confirm("本当に削除しますか？")) {
      router.delete(route("admin.seasonings.destroy", id));
    }
  };

  return (
    <AdminShell title="調味料管理">
      <Head title="調味料管理" />

      {/* フィルタ */}
      <form onSubmit={submit} className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="調味料名・ブランド名"
            className="border rounded-md px-3 py-2 w-64"
          />
          <select value={genre} onChange={(e)=> setGenre(e.target.value)} className="border rounded-md px-2 py-2">
            <option value="">ジャンル(全て)</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={sort} onChange={(e)=> setSort(e.target.value)} className="border rounded-md px-2 py-2">
            <option value="updated">新着順</option>
            <option value="name">名前順</option>
            <option value="price">価格順</option>
          </select>
          <button type="submit" className="bg-main text-white px-3 py-2 rounded-md">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <Link
          href={route("admin.seasonings.create")}
          className="ml-auto bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-md flex items-center gap-1"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>新規追加</span>
        </Link>
      </form>

      {/* テーブル */}
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-2 text-left w-16">画像</th>
              <th className="p-2 text-left">名前</th>
              <th className="p-2 text-left">ブランド</th>
              <th className="p-2 text-left">ジャンル</th>
              <th className="p-2 text-left">価格</th>
              <th className="p-2 text-left">説明</th>
              <th className="p-2 text-left">ショップURL</th>
              <th className="p-2 text-center">公開</th>
              <th className="p-2 text-center w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.data.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-6 text-center text-gray-500">データがありません</td>
              </tr>
            ) : (
              items.data.map((it) => (
                <tr key={it.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    <img
                      src={it.image_path ? `/storage/${it.image_path}` : "/images/placeholder.jpeg"}
                      alt={it.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">{it.name}</td>
                  <td className="p-2">{it.brand ?? "-"}</td>
                  <td className="p-2">{it.genre ?? "-"}</td>
                  <td className="p-2">{it.price ? `${it.price}円` : "-"}</td>
                  <td className="p-2 max-w-xs truncate text-gray-600 text-xs">{it.description ?? "-"}</td>
                  <td className="p-2 max-w-xs">
                    {it.shop_url ? (
                      <a href={it.shop_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs truncate block">
                        {it.shop_url}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    {it.is_published ? <span className="text-green-600 font-medium">公開</span> : <span className="text-gray-400">非公開</span>}
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={route("admin.seasonings.edit", it.id)} className="text-blue-600 hover:underline">
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <button onClick={() => handleDelete(it.id)} className="text-red-500 hover:text-red-700">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {items.links?.length > 3 && (
        <div className="flex justify-center mt-4 gap-2">
          {items.links.map((l, i) => (
            <button
              key={i}
              disabled={!l.url}
              onClick={() => router.visit(l.url)}
              className={`px-3 py-1 rounded-md ${l.active ? "bg-main text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"}`}
              dangerouslySetInnerHTML={{ __html: l.label }}
            />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
