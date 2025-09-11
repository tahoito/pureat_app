// resources/js/Components/FavoriteButton.jsx
import { useState } from "react";
import { router } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export default function FavoriteButton({
  recipeId,
  initial = false,
  iconOnly = false,
  className = "",
  activeBg = "text-accent",
  inactiveBg = "text-white/90",
}) {
  const [fav, setFav] = useState(!!initial);
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    if (loading) return;
    setLoading(true);
    router.post(route("recipes.favorite.toggle", recipeId), {}, {
      preserveScroll: true,
      onSuccess: () => setFav(v => !v),
      onFinish: () => setLoading(false),
    });
  };

  const icon = fav ? faHeartSolid : faHeartRegular;

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-label={fav ? "お気に入り解除" : "お気に入りに追加"}
        className={[
          "p-2 rounded-full transition disabled:opacity-60 disabled:pointer-events-none",
          fav ? `${activeBg} text-white` : `${inactiveBg} text-white/90 hover:bg-white/10`,
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/60",
          className
        ].join(" ")}
      >
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={fav}
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border transition",
        fav
          ? `${activeBg} text-white border-transparent`
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
        className
      ].join(" ")}
    >
      <FontAwesomeIcon icon={icon} />
      <span className="text-gray-800">{fav ? "お気に入り" : "お気に入りに追加"}</span>
    </button>
  );
}
