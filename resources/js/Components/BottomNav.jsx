import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlus, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";


const items = [
    { href:"/", label:"調べる",icon:faSearch, match:"/"},
    { href:"/view", label:"閲覧履歴",icon:faClock, match:"/view"},
    { href:"/add", label:"追加する",icon:faPlus, match:"/add"},
    { href:"/favorite", label:"お気に入り",icon:faHeart, match:"/favorite"},
   // { href:"/share", label:"共有",icon:"", match:"/share"},
];

export default function BottomNav(){
    const { url } = usePage();
    return(
        <nav
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w
                border-t border-main/30
                bg-main
                text-white
                pb-[env(safe-area-inset-bottom)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)"}}
        >
            <ul className="grid grid-cols-4 text-center">
                {items.map((i) => {
                    const active = url.startsWith(i.match);
                    return (
                    <li key={i.href}>
                    <Link
                        href={i.href}
                        className={`h-[64px] w-full flex flex-col items-center justify-center
                        ${active ? "bg-main text-gray-800 font-medium" : "bg-main text-white-600"} hover:bg-main-100`}
                    >
                <FontAwesomeIcon icon={i.icon} className="text-2xl" />
                <span className="text-[10px] mt-0.5">{i.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
