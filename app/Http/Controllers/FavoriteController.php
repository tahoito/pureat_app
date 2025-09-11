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
        $recipes = $request->user()->favoriteRecipes()
            ->with(['tags:id,name,slug', 'category:id,name'])
            ->select(['recipes.id','title','description','total_minutes','main_image_path','category_id'])          
            ->orderByDesc('favorites.created_at')
            ->paginate(12)
            ->through(function (Recipe $r) {    
                return [
                    'id'             => $r->id,
                    'title'          => $r->title,
                    'description'    => $r->description,
                    'total_minutes'  => $r->total_minutes,
                    'category'       => $r->category ? ['id'=>$r->category->id,'name'=>$r->category->name] : null,
                    'tags'           => $r->tags->map(fn($t)=>['id'=>$t->id,'name'=>$t->name,'slug'=>$t->slug])->all(),
                    'main_image_url' => (function ($path) {
                        if (!$path) return null;
                        if (\Illuminate\Support\Str::startsWith($path, ['http://','https://'])) {
                            $base = rtrim(config('app.url'), '/');
                            return preg_replace('#^https?://[^/]+#', $base, $path);
                        }
                        return url(\Illuminate\Support\Facades\Storage::disk('public')->url($path));
                    })($r->main_image_path),
                ];
            })   
            ->withQueryString();

        return Inertia::render('Favorites/Index', [
            'recipes' => $recipes,
        ]);        
    }
}
