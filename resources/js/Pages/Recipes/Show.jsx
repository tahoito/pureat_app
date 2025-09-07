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

                <div className="bg-white border border-main/10 px-4 py-3">

                    <h1 className="text-2xl font-bold text-center">{recipe.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                        {recipe.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-base border border-main/30 text-text-700 text-sm">
                            {recipe.category.name}
                        </span>
                        )}
                        {Array.isArray(recipe.tags) &&
                        recipe.tags.length > 0 &&
                        recipe.tags.map((t) => (
                            <Link
                            key={t.id}
                            href={
                                typeof route == "function"
                                ? route("explore", { tag: t.slug })
                                : `/ ?tag=${encodeURIComponent(t.slug)}`
                            }
                            className="px-3 py-1 rounded-full border bg-white border-main/30 text-gray-700 text-sm"
                            >
                            #{t.name}
                            </Link>
                        ))}
                    </div>

                    {recipe.description && (
                        <p className="mt-3 text-sm text-text-700 leading-relaxed whitespace-pre-wrap text-center">
                            {recipe.description}
                        </p>
                    )}
                </div>

                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                    <section className="px-4 py-4">
                        <div className="max-w-md mx-auto">
                            <h2 className="flex items-center justify-center gap-2 text-lg font-semibold">
                                材料
                                {typeof recipe.servings === "number" && (
                                    <span className="text-sm text-gray-700 flex items-center gap-1">
                                        <FontAwesomeIcon icon={faUser} />
                                        {recipe.servings}人分
                                    </span>
                                )}
                            </h2>
                            <ul className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
                                {recipe.ingredients.map((ing, i) => (
                                    <React.Fragment key={ing.id ?? i}>
                                        <li className="text-text">{ing.name}</li>
                                        <li className="text-text text-right">{ing.amount}</li>
                                    </React.Fragment>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
                    <section className="px-4 py-4">
                        <div className="max-w-md mx-auto">
                            <h2 className="flex items-center justify-center gap-2 text-lg font-semibold">
                                作り方
                                {typeof recipe.total_minutes === "number" && (
                                    <span className="text-sm text-gray-700 flex items-center gap-1">
                                        <FontAwesomeIcon icon={faClock} />
                                        {recipe.total_minutes}分
                                    </span>
                                )}
                            </h2>
                            <ol className="mt-2 space-y-3">
                                {recipe.steps.map((st, i) => (
                                    <li key={st.id ?? i} className="flex items-baseline gap-3">
                                        <span className="mt-2 w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">
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
