import React, { useState, useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AddPage() {
  const page = usePage();
  const categories = Array.isArray(page?.props?.categories) ? page.props.categories : [];
  const tags       = Array.isArray(page?.props?.tags)       ? page.props.tags       : [];
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    servings: "",
    total_minutes: "",
    category_id:"",
    tag_ids:[],
    tag_names:[],
    ingredients:[
        { name: "", amount:""},
        { name: "", amount:""}
    ],
    steps:["",""],
    main_image: null,
  });

  const [tagInput, setTagInput] = useState("");
  const TAG_ACTIVE   = "px-3 py-1 rounded-full border text-sm bg-amber-500 border-amber-500 text-white";
  const TAG_INACTIVE = "px-3 py-1 rounded-full border text-sm bg-white border-main/30 text-gray-700";
  const addTagFromInput = () => {
    const name = tagInput.trim();
    if(!name) return;
    const found = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if(found){
        toggleTag(found.id);
    }else{
        if(!data.tag_names.some(n=> n.toLowerCase()===name.toLowerCase)){
            setData("tag_names",[...data.tag_names,name]);
        }
    }
    setTagInput("");
  }

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!data.main_image) { setPreview(""); return; }
    const url = URL.createObjectURL(data.main_image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [data.main_image]);

  // Ziggy が無くても動くようにフォールバック
  const storeUrl = typeof route === "function" ? route("recipes.store") : "/recipes";

  const toggleTag = (id) => {
    const s = new Set(data.tag_ids);
    s.has(id) ? s.delete(id) : s.add(id);
    setData("tag_ids",Array.from(s))
  };

  const addIngredient = () =>
    setData("ingredients",[...data.ingredients,{name:"",amount:""}]);
  const changeIngredient = (idx,key,val)=>{
    const next = data.ingredients.slice();
    next[idx] = {...next[idx],[key]:val};
    setData("ingredients",next);
  };

  const addStep = () => setData("steps",[...data.steps,""]);
  const changeStep = (idx,val) => {
    const next = data.steps.slice();
    next[idx] = val;
    setData("steps",next);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    post(storeUrl, { forceFormData: true });
  };

  return (
    <AppShell title="追加する" active="add">
      <Head title="レシピを追加" />

      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-30 
        bg-main/90 text-white 
        backdrop-blur 
        h-12
        ">
        <div className="h-12 px-3 flex items-center justify-between">
          <Link href={typeof route === "function" ? route("home.index") : "/"} className="p-2 -ml-2" aria-label="閉じる">
            <FontAwesomeIcon icon={faXmark} className="text-xl text-base" />
          </Link>

          {/* フォーム外から送信 */}
          <button
            type="submit"
            form="recipeForm"
            disabled={processing}
            className="px-3 h-9 text-white rounded-lg bg-amber-500 text-sm font-semibold 
                      hover:bg-amber-600 active:bg-amber-700
                      disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            保存
          </button>
        </div>
      </header>

      {/* ★ フォーム開始（ここから下を包む） */}
      <form id="recipeForm" onSubmit={onSubmit} className="pt-12 p-4 pb-28 space-y-5">

        {/* いちばん上の写真エリア */}
        <section className="rounded-2xl overflow-hidden">
          <label htmlFor="main-image" className="block cursor-pointer" title="画像を選択">
            <div className="relative w-full aspect-[4/3]">
              {preview ? (
                <img src={preview} alt="プレビュー" className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-sm" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1
                  rounded-2xl border-2 border-dashed border-gray-300 bg-white text-gray-500">
                  <p className="text-sm">ここをタップして写真を追加</p>
                  <p className="text-[11px] text-gray-400">（横長でもOK・後から変更できます）</p>
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
            capture="environment"
            className="hidden"
            onChange={(e) => setData("main_image", e.target.files?.[0] ?? null)}
          />
          {errors.main_image && <p className="px-2 py-1 text-xs text-red-600">{errors.main_image}</p>}
        </section>

        {/* 入力ブロック（白背景は内側に1つでOK） */}
        <div className="p-4 pb-8 space-y-5 bg-white">
        <section className="p-4 space-y-3">
          <div>
            <label htmlFor="title" className="block text-lg text-text text-center">料理名</label>
            <input
                id="title" name="title"
              className="mt-1 w-full rounded-lg border p-2"
              placeholder="和風パスタ"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>
        </section>

        <section className="p-4 space-y-3">
            <label htmlFor="category_id" className="block text-sm text-gray-600">カテゴリー</label>
            <select 
                id="category_id" name="category_id"
                className="mt-1 w-full rounded-lg border p-2"
                value={data.category_id}
                onChange={(e) => setData("category_id",e.target.value)}
            >
                <option value="">選択してください</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            {errors.category_id && <p className="text-xs text-red-600">{errors.category_id}</p>}
        </section>

        <section className="p-4 space-y-3">
            <label className="block text-sm text-gray-600">タグ</label>
            <div className="flex flex-wrap gap-2">
            {(tags ?? []).map(t => {
            const active = (data.tag_ids ?? []).includes(t.id);
            return (
                <button
                type="button" key={t.id} onClick={() => toggleTag(t.id)}
                className={active ? TAG_ACTIVE : TAG_INACTIVE}
                >
                #{t.name}
                </button>
            );
        })}
    </div>

    {/* 新規タグ入力 */}
    <div className="flex items-center gap-2">
        <input
        id="tag_input" name="tag_input"
        className="flex-1 rounded-lg border p-2"
        placeholder="タグを追加"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTagFromInput();
                    }
                }}
            />
            <button type="button" onClick={addTagFromInput}
            className="px-3 py-2 rounded-lg border">
            追加
            </button>
        </div>

        {(Array.isArray(data.tag_names) && data.tag_names.length > 0) && (
        <div className="flex flex-wrap gap-2">
            {data.tag_names.map((name, i) => (
            <span key={i} className={TAG_ACTIVE}>
                #{name}
            </span>
            ))}
        </div>
        )}
        </section>

        <section className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="servings" className="block text-sm text-gray-600">人数</label>
              <input
                id="servings" name="servings"
                type="number" min="1" inputMode="numeric" pattern="\d*"
                className="mt-1 w-full rounded-lg border p-2"
                value={data.servings}
                onChange={(e) => setData("servings", e.target.value)}
                placeholder="2"
              />
              {errors.servings && <p className="mt-1 text-xs text-red-600">{errors.servings}</p>}
            </div>
            <div>
              <label htmlFor="total_minutes" className="block text-sm text-gray-600">調理時間(分)</label>
              <input
                id="total_minutes" name="total_minutes"
                type="number" min="0"
                className="mt-1 w-full rounded-lg border p-2"
                value={data.total_minutes}
                onChange={(e) => setData("total_minutes", e.target.value)}
                placeholder="15"
              />
              {errors.total_minutes && <p className="mt-1 text-xs text-red-600">{errors.total_minutes}</p>}
            </div>
          </div>
        </section>


        {/* 材料 */}
        <section className="p-4 space-y-3">
          <div className="flex justify-center">
            <label className="block w-full text-lg text-text text-center">材料</label>
          </div>

          <div className="space-y-2">
            {data.ingredients.map((ing, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_100px] gap-2">
                <input
                className="rounded-lg border p-2"
                placeholder="例：スパゲッティ"
                value={ing.name}
                onChange={(e) => changeIngredient(idx, "name", e.target.value)}
                />
                <input
                className="rounded-lg border p-2"
                placeholder="100g"
                value={ing.amount ?? ""}
                onChange={(e) => changeIngredient(idx, "amount", e.target.value)}
                />
            </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button type="button" className="text-amber-600 text-sm"
                onClick={addIngredient}>
            ＋行を追加</button>
          </div>
        </section>

        {/* 作り方 */}
        <section className="p-4 space-y-3">
          <div className="flex justify-center">
            <label className="block w-full text-lg text-text text-center">作り方</label>
          </div>

          <ol className="space-y-2">
            {data.steps.map((s, idx) => (
            <li key={idx} className="flex items-start gap-2">
                <span className="mt-2 w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
                {idx + 1}
                </span>
                <textarea
                rows={2}
                className="flex-1 rounded-lg border p-2"
                placeholder="例：パスタを茹でる"
                value={s}
                onChange={(e) => changeStep(idx, e.target.value)}
                />
            </li>
            ))}
          </ol>

          <div className="flex justify-center">
            <button type="button" className="text-amber-600 text-sm"
            onClick={addStep}>+ 手順を追加</button>
          </div>
        </section>

        <section className="p-4 space-y-2">
          <label htmlFor="description" className="block text-base text-text text-center">
            メモ（任意）
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-lg border p-2 text-sm"
            placeholder="パスタは茹で過ぎない"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </section>
        </div>

      </form>
    </AppShell>
  );
}
