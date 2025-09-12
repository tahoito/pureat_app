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
  activeColor = "text-accent",     // ← ここを accent でOK
  inactiveColor = "text-white/90",
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
        className={`p-2 rounded-full transition disabled:opacity-60 ${className}`}
      >
        <FontAwesomeIcon
          icon={icon}
          className={`text-lg ${fav ? activeColor : inactiveColor}`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={fav}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border transition ${className} bg-white border-gray-300 hover:bg-gray-50`}
    >
      <FontAwesomeIcon
        icon={icon}
        className={fav ? activeColor : "text-gray-700"}
      />
      <span className="text-gray-800">{fav ? "お気に入り" : "お気に入りに追加"}</span>
    </button>
  );
}
