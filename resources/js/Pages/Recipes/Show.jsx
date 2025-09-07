import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClock, faHeart } from "@fortawesome/free-solid-svg-icons";

export default function RecipeShow() {
    const { recipe, isFavorite = false} = usePage().props;
    const img = recipe.main_image || "/images/placeholder.png";

    return (
        <AppShell title={recipe.title} active="">
            <Head title={recipe.title}/>

            <header className="sticky top-0 z-30 bg-main/95 backdrop-blur border-b">
                <div class="h-12 px-3 flex items-center justify-between">
                    <Link href={typeof route === "function" ? route("explore") : "/"} className="p-2 -ml-2">
                        <FontAwesomeIcon  icon={faArrowLeft} className="text-xl text-base" />
                    </Link>
                    <div class="flex items-center gap-3">
                        <button type="button" aria-label="お気に入り" className={`p-2 ${isFavorite ? "text-amber-500" : ""}`}>
                            <FontAwesomeIcon icon={faHeart} className="text-lg text-base"/>
                        </button>
                    </div> 
                </div>
            </header>

            <div className="pb-28">
                <div className="w-full aspect-[4/3] bg-gray-100">
                    <img src={img} alt={recipe.title} className="w-full h-full object-cover"/>
                </div> 

                <div className="p-4 space-y-2 bg-white">
                    <h1 className="text-xl font-semibold">{recipe.title}</h1>

                    <div className="flex flex-wrap items-center gap-3 text-gray-600">
                        {recipe.category && (
                            <span className="px-2 py-0.5 rounded-full bg-base border border-main/30 text-gray-700">
                                {recipe.category.name}
                            </span>
                        )}

                        {typeof recipe.servings === "number" && (
                            <span className="inline-flex items-center gap-1">
                                <FontAwesomeIcon icon={faUser} />
                                <span>{recipe.servings}人分</span>
                            </span>
                        )}

                        {typeof recipe.total_minutes === "number" && (
                            <span className="inline-flex items-center gap-1">
                                <FontAwesomeIcon icon={faClock}/>
                                <span>{recipe.total_minutes}分</span>
                            </span>
                        )}
                    </div>

                    {recipe.description && (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{recipe.description}</p>
                    )}

                    {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {recipe.tags.map(t => (
                                <Link   
                                    key={t.id}
                                    href={typeof route == "function" ? route("explore",{ tag:t.slug}) : '/?tag=${encodeURIComponent(t.slug)}'}
                                    className="px-3 py-1 rounded-full border text-sm bg-white border-main/30 text-gray-700"
                                >
                                    #{t.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                    <section className="p-4 space-y-2">
                        <h2 className="text-lg font-semibold">材料</h2>
                        <ul className="space-y-1">
                            {recipe.ingredients.map((ing, i) => (
                                <li key={ing.id ?? i} className="flex justify-between gap-3 text-sm">
                                    <span className="text-gray-800">{ing.name}</span>
                                    <span className="text-gray-500">{ing.amount}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
                    <section className="p-4 space-y-2">
                        <h2 className="text-lg font-semibold">作り方</h2>
                        <ol className="space-y-3">
                            {recipe.steps.map((st,i) => (
                                <li key = {st.id ?? i} className="flex items-start gap-3">
                                    <span className="mt-1 w-6 h-6 rounded-full gb-amber-500 text-white text-xs flex items-center justify-center">
                                        { i + 1 }
                                    </span>
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                        {st.body}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}


            </div>

        </AppShell>
    )


}