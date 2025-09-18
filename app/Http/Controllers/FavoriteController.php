<?php

namespace App\Http\Controllers;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class FavoriteController extends Controller
{
    public function toggle(Request $request, Recipe $recipe)
    {
        $user = $request->user();
        $exists = $user->favoriteRecipes()->where('recipe_id',$recipe->id)->exists();
        if ($exists) {
            $user->favoriteRecipes()->detach($recipe->id);
            $favorited = false;
        } else {
            $user->favoriteRecipes()->attach($recipe->id);
            $favorited = true;
        }

        if($request->wantsJson()){
            return response()->json(['favorited' => $favorited]);
        }return back()->with('flash',[
            'type' => 'success',
            'message' => $favorited ? 'レシピをお気に入りに追加':'レシピをお気に入りから削除',
        ]);
    }

    public function index(Request $request)
    {
        $recipes = $request->user()
            ->favoriteRecipes()
            ->with(['tags:id,name,slug', 'category:id,name'])
            ->select(['recipes.id','recipes.title','recipes.description','recipes.total_minutes','recipes.main_image_path','recipes.category_id'])          
            ->orderByDesc('favorites.created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Favorites/Index', [
            'recipes' => $recipes,
        ]);        
    }
}
