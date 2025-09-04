import React from "react";
import { Head,Link,usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


export default function HomeIndex() {

  const { props } = usePage();
  const { categories = [], tags = []} = usePage().props;

  return (
    <AppShell title="ホーム">
      <Head title="ホーム" />
      
      <div className="p-6 space-y-6">
        <form className="relative"
          onSubmit={(e) => {
            e.preventDefault();
        }}>
          <input 
            className="w-full h-12 pl-12 pr-4 rounded-full border-main/40 outline-none bg-white"
            placeholder="材料や料理名で検索"
          />
          <button 
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
            aria-label="検索"
          >
          <FontAwesomeIcon icon={faSearch} className="text-main"/>
          </button>
        </form>

        <section>
          <h2 className="text-lg mb-2 text-text">カテゴリー</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0,9).map((c)=>(
              <Link 
                key={c.name}
                href={'/recipes?category=${encodeURIComponent(c.name)}'}
                className="relative h-16 rounded-xl border border-main/30 overflow-hidden group"
              >
                <img
                  src={c.image_url}
                  alt={c.name}
                  className="absolute inset-0 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute left-2 bottom-2 z-10 text-white text-xs font-semibold drop-shadow">{c.icon}
                  {c.name}
                </span>
              </Link>
            ))}
          </div>

        </section>

        <section>
          <h2 className="text-lg mb-2 text-text">タグ</h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tags.map((t) => (
              <Link
                key={t.slug}
                href={'/recipes?tag=${encodeURIComponent(t)}'}
                className="shrink-0 px-3 h-9 rounded-full border border-main/30 bg-white text-sm flex items-center hover:bg-base"
              >{t.name}</Link>
            ))}
          </div>
        </section>

      </div> 

    </AppShell>
  );
}
