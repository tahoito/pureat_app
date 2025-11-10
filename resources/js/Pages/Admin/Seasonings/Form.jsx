import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminShell from "@/Layouts/AdminShell";

export default function FormPage() {
  const { item, genres } = usePage().props;
  const isEdit = !!item;

  const { data, setData, post, processing, errors } = useForm({
    name: item?.name ?? "",
    brand: item?.brand ?? "",
    genre: item?.genre ?? "",
    price: item?.price ?? "",
    image: null,
    gf: item?.gf ?? true,
    df: item?.df ?? true,
    sf: item?.sf ?? true,
    af: item?.af ?? true,
    ingredients_text: item?.ingredients_text ?? "",
    description: item?.description ?? "",
    is_published: item?.is_published ?? true,
    _method: isEdit ? "put" : "post",   // ★ 更新時は最初から put
  });

  const submit = (e) => {
    e.preventDefault();

    console.log("submit data", data);   // ★ ブラウザで確認用

    if (isEdit) {
      post(route("admin.seasonings.update", item.id), {
        forceFormData: true,            // ★ Fileを含めてFormDataで送る
        preserveScroll: true,
        onFinish: () => setData("image", null),
      });
    } else {
      post(route("admin.seasonings.store"), {
        forceFormData: true,
        preserveScroll: true,
        onFinish: () => setData("image", null),
      });
    }
  };

  return (
    <AdminShell title={isEdit ? "調味料を編集" : "調味料を追加"}>
      <Head title={isEdit ? "調味料編集" : "調味料追加"} />

      <form
        onSubmit={submit}
        className="bg-white border rounded-lg p-4 space-y-4 max-w-3xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">名前</span>
            <input
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm">ブランド</span>
            <input
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={data.brand}
              onChange={(e) => setData("brand", e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm">ジャンル</span>
            <select
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={data.genre}
              onChange={(e) => setData("genre", e.target.value)}
            >
              <option value="">選択なし</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm">価格</span>
            <input
              type="number"
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={data.price}
              onChange={(e) => setData("price", e.target.value)}
            />
          </label>

          <label className="block">
          <span className="text-sm">内容量</span>
            <div className="flex gap-2">
              <input
                type="number"
                className="mt-1 w-24 border rounded-md px-3 py-2"
                value={data.quantity ?? ""}
                onChange={(e) => setData("quantity", e.target.value)}
                placeholder="300"
              />
              <select
                className="mt-1 w-24 border rounded-md px-2 py-2"
                value={data.quantity_unit ?? ""}
                onChange={(e) => setData("quantity_unit", e.target.value)}
              >
                <option value="">単位</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
                <option value="L">L</option>
              </select>
            </div>
          </label>


          <label className="block sm:col-span-2">
            <span className="text-sm">画像</span>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full"
              onChange={(e) => setData("image", e.target.files[0])}
            />
            {item?.image_path && (
              <img
                src={`/storage/${item.image_path}`}
                alt=""
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["gf", "df", "sf", "af"].map((k) => (
            <label
              key={k}
              className="flex items-center gap-2 border rounded-md px-3 py-2"
            >
              <input
                type="checkbox"
                checked={!!data[k]}
                onChange={(e) => setData(k, e.target.checked)}
              />
              <span className="text-sm uppercase">{k}</span>
            </label>
          ))}
        </div>

        <label className="block">
          <span className="text-sm">成分（テキスト）</span>
          <textarea
            className="mt-1 w-full border rounded-md px-3 py-2"
            rows={3}
            value={data.ingredients_text}
            onChange={(e) =>
              setData("ingredients_text", e.target.value)
            }
          />
        </label>

        <label className="block">
          <span className="text-sm">説明</span>
          <textarea
            className="mt-1 w-full border rounded-md px-3 py-2"
            rows={4}
            value={data.description}
            onChange={(e) =>
              setData("description", e.target.value)
            }
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!data.is_published}
            onChange={(e) =>
              setData("is_published", e.target.checked)
            }
          />
          <span className="text-sm">公開する</span>
        </label>

        <div className="flex gap-2 pt-2">
          <button
            disabled={processing}
            className="px-4 py-2 rounded-md bg-main text-white disabled:opacity-50"
          >
            {isEdit ? "更新する" : "追加する"}
          </button>
          <Link
            href={route("admin.seasonings.index")}
            className="px-4 py-2 rounded-md border bg-white"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </AdminShell>
  );
}

