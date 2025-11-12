import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function SeasoningsShow() {
    const { item } = usePage().props;
    if (!item) return <div>読み込み中...</div>;
    const search = typeof window !== "undefined" ? window.location.search : "";
    const params = new URLSearchParams(search);
    const from = params.get("from");


    const updated = params.get("updated") === "1";

    const fallback = 
        from === "favorites"
            ? route("favorites.index")
            : from === "history"
            ? route("history.index")
            : route("home.index");


    const goBack = React.useCallback (() => {
        if(from) {
            router.visit(fallback,{ replace:true, preserveScroll:true});
        }else{
            router.visit(route('home.index'),{ replace:true });
        }
    },[from, fallback, updated]);

    const img =
    item.image_url
      ? item.image_url
      : item.image_path
        ? `/storage/${item.image_path}`
        : "/images/placeholder.jpeg";


    function AddToShoppingButton({ seasoningId }) {
    const KEY = `shopping:addedUntil:${seasoningId}`;
    const [adding, setAdding] = React.useState(false);
    const [added,  setAdded]  = React.useState(false);

   
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
        await axios.post(route("shopping-list.add"), { recipe_id: recipeId });

        //12時間
        const EXPIRE_MS = 12 * 60 * 60 * 1000;
        localStorage.setItem(KEY, String(Date.now() + EXPIRE_MS));

        setAdded(true);
        } catch (e) {
        // 失敗時は一旦addedを戻す
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
        className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full 
            text-xs font-medium whitespace-nowrap shadow-sm transition
            ${added
            ? "bg-accent2 text-white border border-accent2"
            : "bg-accent2 text-white hover:bg-accent2 active:scale-[0.98]"} 
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

            <header className="fixed top-0 left-0 right-0 z-30 
                bg-main/90 text-white 
                backdrop-blur 
                h-12
                ">
                <div className="h-full px-3 flex items-center justify-between">
                    <button 
                        type="button"
                        onClick={goBack}
                        className="p-2 -ml-2"
                        aria-label="戻る">
                        <FontAwesomeIcon icon={faArrowLeft} className="text-xl text-base" />
                    </button>
                </div>
            </header>

            <div className="pt-14 pb-28 px-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="md:w-1/2 w-full aspect-square bg-gray-100 rounded-md overflow-hidden">
                        <img src={img} alt={item.name} 
                            className="w-full h-full object-contain p-3" />
                    </div>
                </div>

                <div className="md:w-1/2 w-full bg-white border border-main/10 rounded-md">
                    <h1 className="text-2xl font-bold tracking-wide text-gray-800 mb-3">
                        { item.name}
                    </h1>

                    {item.brand && (
                        <p className="text-sm text-gray-500 mb-1">ブランド：{item.brand}</p>
                    )}
                    {item.genre && (
                        <p className="text-sm text-gray-500 mb-1">ジャンル：{item.genre}</p>
                    )}
                    {item.price && (
                        <p className="text-sm text-gray-500 mb-1">
                            価格：{item.price}円
                            {item.quantity && item.quantity_unit && (
                                <> / {item.quantity}{item.quantity_unit}</>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
