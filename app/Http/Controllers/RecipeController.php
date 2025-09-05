<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
class RecipeController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required','string','max:255'],
            'servings' => ['nullable','integer','min:1'],
            'total_minutes' => ['nullable','integer','min:0'],
            'main_image' => ['nullable','image','max:5120']
        ]);

        $imageUrl = null;
        if ($request->hasFile('main_image')){
            $path = $request->file('main_image')->store('recipes','public');
            $imageUrl = Storage::url($path);
        }

        $recipe = Recipe::create([
            'user_id' => $request->user()->id,
            'category_id' => 1,
            'title' => $validated['title'],
            'description' => $request->input('description'),
            'servings' => $validated['servings'] ?? null,
            'total_minutes'   => $validated['total_minutes'] ?? null,
            'main_image_path' => $imageUrl,     
            'is_recommended'  => 0,
        ]);

        return redirect()->route('explore',['tab' => 'all', 'highlight' => $recipe->id])
            -with('flash',['type' => 'success', 'message' => 'レシピ追加完了']);
    }
}
