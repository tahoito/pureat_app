import React from "react";
import { Head,Link,usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


export default function HomeIndex() {

  const { props } = usePage();
  const { categories = [], tags = []} = props;

  return (
    <AppShell title="ホーム">
      <Head title="ホーム" />
      
      <div className="p-4 space-y-6">
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
            {categories.map((c)=>(
              <Link 
                key={c.name}
                href={'/recipes?category=${encodeURLComponent(c.name)}'}
                className="h-16 rounded-xl border border-main/30 bg-white flex flex-col items-center justify-center text-xs"
              >
                <div className="text-xl">{c.icon}</div>
                <div className="mt-1">{c.name}</div>
              </Link>
            ))}
          </div>

        </section>

        <section>
          <h2 className="text-lg mb-2 text-text">タグ</h2>
        </section>




      </div> 

    </AppShell>
  );
}
