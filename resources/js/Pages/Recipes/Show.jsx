import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClock, faUser, faPen } from "@fortawesome/free-solid-svg-icons";
import FavoriteButton from "@/Components/FavoriteButton";

export default function RecipeShow() {
    const { recipe, isFavorite } = usePage().props;
    const img = recipe.main_image || "/images/placeholder.png";
    const hasZiggy = typeof route === 'function' && window?.Ziggy?.routes && window.Ziggy.routes['recipes.edit'];
    const editHref = hasZiggy ? route('recipes.edit', recipe.id) : `/recipes/${recipe.id}/edit`;

    return (
        <AppShell title={recipe.title} active="">
            <Head title={recipe.title} />

            <header className="fixed top-0 left-0 right-0 z-30 
                bg-main/90 text-white 
                backdrop-blur 
                h-12
                ">
                <div className="h-full px-3 flex items-center justify-between">
                    <Link href={typeof route === "function" ? route("home.index") : "/"} className="p-2 -ml-2">
                        <FontAwesomeIcon icon={faArrowLeft} className="text-xl text-base" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link 
                            href={editHref}
                            className="p-2"
                            aria-label="編集"
                        >
                        <FontAwesomeIcon icon={faPen} className="text-lg text-base"/>
                        </Link>
                        <FavoriteButton
                            recipeId={recipe.id}
                            initial={isFavorite}
                            iconOnly
                            activeBg="text-accent"
                            inactiveBg="text-white/90"
                        />
                    </div>
                </div>
            </header>

            <div className="pt-12 pb-28">
                <div className="w-full aspect-[4/3] bg-gray-100">
                    <img src={img} alt={recipe.title} className="w-full h-full object-cover" />
                </div>

                <div className="bg-white border border-main/10 px-5 py-7">
                    <h1 className="text-3xl font-bold tracking-wide text-center">{recipe.title}</h1>
                    {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                            {recipe.tags.map((t) => (
                            <span
                                key={t.id}
                                className="px-2 py-0.5 rounded-full border border-main/20 bg-white text-gray-600 text-xs"
                            >
                                #{t.name}
                            </span>
                            ))}
                        </div>
                    )}
                </div>

                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                    <section className="px-4 py-4">
                        <div className="w-full mx-auto max-w-[18rem]">
                            <div className="flex items-center justify-center gap-2">
                                <h2 className="text-xl font-semibold">材料</h2>
                                {typeof recipe.servings === "number" && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-base text-[11px] text-gray-700">
                                        <FontAwesomeIcon icon={faUser} className="text-[11px]" aria-hidden="true" />
                                        {recipe.servings}人分
                                    </span>
                                )}
                            </div>
                            <ul className="mt-3 text-sm leading-tight">
                                {recipe.ingredients.map((ing, i) => {
                                    const amt = (ing.amount ?? '').toString().trim();
                                    return (
                                        <li key={ing.id ?? i} className="flex justify-between items-center py-2 border-b border-dotted border-gray-300 last:border-0">
                                            <span className="text-text">{ing?.name ?? ""}</span>
                                            <span className="text-text font-mono tabular-num ml-3">
                                            {amt !== '' ? amt : '-'}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </section>
                )}

                {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
                    <section className="px-4 py-4">
                        <div className="w-full mx-auto max-w-[18rem]">
                            <div className="flex items-center justify-center gap-2">
                                <h2 className="text-xl font-semibold">作り方</h2>
                                {typeof recipe.total_minutes === "number" && (
                                    <span className="text-xs text-gray-500/80 flex items-center gap-1">
                                        <FontAwesomeIcon icon={faClock} className="text-[11px]"/>
                                        {recipe.total_minutes}分
                                    </span>
                                )}
                            </div>
                            <ol className="mt-3 space-y-2.5">
                                {recipe.steps.map((st, i) => (
                                    <li key={st.id ?? i} className="flex items-start gap-3">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white leading-none">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-gray-800 leading-relaxed">{st.body}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </section>
                )}

                {recipe.description && recipe.description.trim() !== "" && (
                <section className="px-4 py-4">
                    <div className="w-full mx-auto max-w-[18rem]">
                    <div className="flex items-center justify-center gap-2">
                        <h2 className="text-xl font-semibold">メモ</h2>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 text-center whitespace-pre-line leading-relaxed">
                        {recipe.description}
                    </p>
                    </div>
                </section>
                )}
            </div>
        </AppShell>
    );
}
