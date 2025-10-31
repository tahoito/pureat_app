import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faJar, faPlus, faHeart, faSearch, faListSquares } from "@fortawesome/free-solid-svg-icons";


const items = [
    { href:"/", label:"調べる",icon:faSearch, match:"/"},
    { href:"/seasonings", label:"調味料検索",icon:faJar, match:"/seasoning"},
    { href:"/add", label:"追加する",icon:faPlus, match:"/add"},
    { href:"/favorites", label:"お気に入り",icon:faHeart, match:"/favorites"},
    { href:"/shopping-list", label:"買い物リスト",icon:faListSquares, match:"/shopping-list"},
];

export default function BottomNav(){
    const { url } = usePage();
    const pathname = url.split("?")[0];
    return(
        <nav
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w
                border-t border-main/30
                bg-main
                text-white
                pb-[env(safe-area-inset-bottom)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)"}}
        >
            <ul className="grid grid-cols-5 text-center">
                {items.map((i) => {
                    const active = i.match === "/" ? pathname === "/" : pathname.startsWith(i.match);
                    return (
                    <li key={i.href}>
                    <Link
                        href={i.href}
                        aria-current={active ? "page" : undefined}
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
