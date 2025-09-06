<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\{Recipe, Category, Tag, Ingredient, Step};
use Illuminate\Support\Facades\Storage; 


class RecipeController extends Controller
{
    public function create()
    {
        return Inertia::render('Add/Index', [
            'categories' => Category::orderBy('sort_order')->orderBy('id')->get(['id','name']),
            'tags' => Tag::orderBy('name')->get(['id','name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required','string','max:255'],
            'description'   => ['nullable','string'],
            'servings' => ['nullable','integer','min:1'],
            'total_minutes' => ['nullable','integer','min:0'],
            'category_id'   => ['required','exists:categories,id'],
            'tag_ids' => ['array'],
            'tag_ids.*' => ['integer','exist:tags,id'],
            'main_image' => ['nullable','image','max:5120'],

            'ingredients' => ['array'],
            'ingredients.*.name' => ['required_with:ingredients','string','max:255'],
            'ingredients.*.amount' => ['nullable','string','max:225'],

            'steps'       => ['array'],
            'steps.*'     => ['required','string'],
        ]);

        $imageUrl = null;
        if ($request->hasFile('main_image')){
            $path = $request->file('main_image')->store('recipes','public');
            $imageUrl = Storage::url($path);
        }

        $recipe = DB::transaction(function () use ($request, $validated, $imageUrl) {

            $recipe = Recipe::create([
                'user_id'         => $request->user()->id,
                'category_id'     => $validated['category_id'],
                'title'           => $validated['title'],
                'description'     => $validated['description'] ?? null,
                'servings'        => $validated['servings'] ?? null,
                'total_minutes'   => $validated['total_minutes'] ?? null,
                'main_image_path' => $imageUrl,
                'is_recommended'  => 0,
            ]);

            $recipe->tags()->sync($validated['tag_ids']??[]);
            foreach(($validated['ingredients']??[]) as $i => $ing){
                if(!trim($ing['name'] ?? '')) continue;
                Ingredient::create([
                    'recipe_id' => $recipe->id,
                    'name' => $ing['name'],
                    'amount' => $ing['amount'] ?? null,
                    'position' => $i + 1,
                ]);
            }

            foreach (($validated['steps'] ?? []) as $i => $body) {
                if (!trim($body ?? '')) continue;
                Step::create([
                    'recipe_id' => $recipe->id,
                    'body'      => $body,
                    'position'  => $i + 1,
                ]);
            }

        return $recipe;
    });


    return redirect()
        ->route('explore', ['tab' => 'all', 'highlight' => $recipe->id])
        ->with('flash', ['type' => 'success', 'message' => 'レシピを追加したよ']);

    }
}
