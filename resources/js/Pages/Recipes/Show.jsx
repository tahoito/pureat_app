import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClock, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";

export default function RecipeShow() {
    const { recipe, isFavorite = false } = usePage().props;
    const img = recipe.main_image || "/images/placeholder.png";

    return (
        <AppShell title={recipe.title} active="">
            <Head title={recipe.title} />

            <header className="fixed top-0 left-0 right-0 z-30 
                bg-main/90 text-white 
                backdrop-blur 
                h-12
                ">
                <div className="h-full px-3 flex items-center justify-between">
                    <Link href={typeof route === "function" ? route("explore") : "/"} className="p-2 -ml-2">
                        <FontAwesomeIcon icon={faArrowLeft} className="text-xl text-base" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="お気に入り"
                            className={`p-2 ${isFavorite ? "text-amber-500" : ""}`}
                        >
                            <FontAwesomeIcon icon={faHeart} className="text-lg text-base" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="pt-12 pb-28">
                <div className="w-full aspect-[4/3] bg-gray-100">
                    <img src={img} alt={recipe.title} className="w-full h-full object-cover" />
                </div>

                <div className="bg-white border border-main/10 px-5 py-7">
                    <h1 className="text-3xl font-bold text-center">{recipe.title}</h1>
                    {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
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
                            <h2 className="flex items-center justify-center gap-2 text-xl font-semibold">
                                材料
                                {typeof recipe.servings === "number" && (
                                    <span className="text-xs text-gray-500/80 flex items-center gap-1">
                                        <FontAwesomeIcon icon={faUser} className="text-[12px]" />
                                        {recipe.servings}人分
                                    </span>
                                )}
                            </h2>
                            <ul className="mt-2 grid grid-cols-2 gap-y-1.5 text-sm leading-tight">
                                {recipe.ingredients.map((ing, i) => {
                                    const amt = (ing.amount ?? '').toString().trim();
                                    return (
                                        <React.Fragment key={ing.id ?? i}>
                                        <li className="text-text">{ing.name}</li>
                                        <li className="text-text text-right font-mono">
                                            {amt !== '' ? amt : '-'}</li>
                                        </React.Fragment>

                                    );
                                })}
                            </ul>
                        </div>
                    </section>
                )}

                {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
                    <section className="px-4 py-4">
                        <div className="w-full mx-auto max-w-[18rem]">
                            <h2 className="flex items-center justify-center gap-2 text-xl font-semibold">
                                作り方
                                {typeof recipe.total_minutes === "number" && (
                                    <span className="text-xs text-gray-500/80 flex items-center gap-1">
                                        <FontAwesomeIcon icon={faClock} className="text-[11px]"/>
                                        {recipe.total_minutes}分
                                    </span>
                                )}
                            </h2>
                            <ol className="mt-2 space-y-2">
                                {recipe.steps.map((st, i) => (
                                    <li key={st.id ?? i} className="flex items-baseline gap-3">
                                        <span className="flex-none inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs leading-none">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-gray-800 leading-relaxed">{st.body}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </section>
                )}
            </div>
        </AppShell>
    );
}
