<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;           
use Illuminate\Support\Str;            
use App\Models\{Recipe, Category, Tag, Ingredient, Step, ViewHistory};

class RecipeController extends Controller
{

    public function create()
    {
        return Inertia::render('Add/Index', [
            'categories' => Category::orderBy('sort_order')->orderBy('id')->get(['id','name']),
            'tags'       => Tag::orderBy('name')->get(['id','name','slug']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => ['required','string','max:255'],
            'description'    => ['nullable','string'],
            'servings'       => ['nullable','integer','min:1'],
            'total_minutes'  => ['nullable','integer','min:0'],
            'category_id'    => ['required','exists:categories,id'],
            'tag_ids'        => ['array'],
            'tag_ids.*'      => ['integer','exists:tags,id'],  // ★ exists に修正
            'tag_names'      => ['array'],                      // ★ 新規タグ名
            'tag_names.*'    => ['string','max:30'],
            'main_image'     => ['nullable','image','max:5120'],
            'ingredients'            => ['array'],
            'ingredients.*.name'     => ['required_with:ingredients','string','max:255'],
            'ingredients.*.amount'   => ['nullable','string','max:255'],  // 225→255でもOK

            'steps'       => ['array'],
            'steps.*'     => ['required','string'],
        ]);

        
        $path = $request->hasFile('main_image')
            ? $request->file('main_image')->store('recipes','public')
            :null;

        //$publicUrl = $path ? Storage::disk('public')->url($path):null;
        
        $recipe = DB::transaction(function () use ($request, $validated, $path) {
            $recipe = Recipe::create([
                'user_id'         => $request->user()->id,
                'category_id'     => $validated['category_id'],
                'title'           => $validated['title'],
                'description'     => $validated['description'] ?? null,
                'servings'        => $validated['servings'] ?? null,
                'total_minutes'   => $validated['total_minutes'] ?? null,
                'main_image_path' => $path,
                'is_recommended'  => 0,
            ]);

            // 既存タグID
            $ids = $validated['tag_ids'] ?? [];

            // 新規タグ作成（同名はslugで一意）
            $newIds = collect($validated['tag_names'] ?? [])
                ->map(fn($n) => trim($n))
                ->filter()
                ->map(function ($name) {
                    $slug = Str::slug($name, '-');
                    $tag  = Tag::firstOrCreate(['slug' => $slug], ['name' => $name]);
                    return $tag->id;
                })->all();

            // 紐付け
            $recipe->tags()->sync(array_unique(array_merge($ids, $newIds)));

            // 材料
            foreach (($validated['ingredients'] ?? []) as $i => $ing) {
                if (!trim($ing['name'] ?? '')) continue;
                $amount = isset($ing['amount']) && trim($ing['amount']) !== '' ? $ing['amount'] : null;
                Ingredient::create([
                    'recipe_id' => $recipe->id,
                    'name'      => $ing['name'],
                    'amount'    => $ing['amount'] ?? null,
                    'position'  => $i + 1,
                ]);
            }

            // 手順
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
            ->route('home.index', ['tab' => 'all', 'highlight' => $recipe->id])
            ->with('flash', ['type' => 'success', 'message' => 'レシピを追加したよ']);
    }

    public function show(Request $request, Recipe $recipe)
    {
        $user = $request->user();

        if($user){
            $cutoff = now()->subMinutes(30);
            $exists = ViewHistory::where('user_id',$user->id)
                ->where('recipe_id',$recipe->id)
                ->where('viewed_at','>=',$cutoff)
                ->exists();
            if(!$exists){
                ViewHistory::create([
                    'user_id'   => $user->id,
                    'recipe_id' => $recipe->id,
                    'viewed_at' => now(),
                ]);
            }
        }

        $isFavorite = $request->user()
            ? $user->favoriteRecipes()->whereKey($recipe->id)->exists()
            : false;


        $recipe->load([
            'category:id,name',
            'tags:id,name,slug',
            'ingredients' => fn($q) => $q->orderBy('position')->select('id','recipe_id','name','amount','position'),
            'steps'       => fn($q) => $q->orderBy('position')->select('id','recipe_id','body','position'),
            'user:id,name',   
        ]);

        return Inertia::render('Recipes/Show', [
            'recipe' => [
                'id'            => $recipe->id,
                'title'         => $recipe->title,
                'description'   => $recipe->description,
                'servings'      => $recipe->servings,
                'total_minutes' => $recipe->total_minutes,
                'main_image'    => $recipe->main_image_path,
                'main_image_url'=> $recipe->main_image_url,   
                'category'      => $recipe->category,
                'tags'          => $recipe->tags,
                'ingredients'   => $recipe->ingredients->values(),
                'steps'         => $recipe->steps->values(),
                'author'        => $recipe->user,
                'created_at'    => $recipe->created_at?->toDateTimeString(),
            ],
            'isFavorite' => $isFavorite,
        ]);
    }

    public function edit(Recipe $recipe){
        $recipe->load([
            'category:id,name',
            'tags:id,name,slug',
            'ingredients' => fn($q) => $q->orderBy('position')->select('id','recipe_id','name','amount','position'),
            'steps'       => fn($q) => $q->orderBy('position')->select('id','recipe_id','body','position'),
        ]);

        return Inertia::render('Recipes/Edit',[
            'recipe' => [
                'id' => $recipe->id,
                'title' => $recipe->title,
                'description' => $recipe->description,
                'servings'      => $recipe->servings,
                'total_minutes' => $recipe->total_minutes,
                'main_image'    => $recipe->main_image_path,
                'main_image_url'=> $recipe->main_image_path_url,
                'ingredients'   => $recipe->ingredients->values(),
                'steps'         => $recipe->steps->values(),
                'category'      => $recipe->category,  
                'tags'          => $recipe->tags, 
                'created_at'    => $recipe->created_at?->toDateTimeString(),
            ],
            'categories' => Category::orderBy('sort_order')->orderBy('id')->get(['id','name']),
            'tags' => Tag::orderBy('name')->get(['id','name','slug']),
                
        ]);        
    }

    public function update(Request $request, Recipe $recipe)
    {
        $validated = $request->validate([
            'title'          => ['required','string','max:255'],
            'description'    => ['nullable','string'],
            'servings'       => ['nullable','integer','min:1'],
            'total_minutes'  => ['nullable','integer','min:0'],
            'category_id'    => ['required','exists:categories,id'],
            'tag_ids'        => ['array'],
            'tag_ids.*'      => ['integer','exists:tags,id'],  // ★ exists に修正
            'tag_names'      => ['array'],                      // ★ 新規タグ名
            'tag_names.*'    => ['string','max:30'],
            'main_image'     => ['nullable','image','max:5120'],
            'ingredients'            => ['array'],
            'ingredients.*.name'     => ['required_with:ingredients','string','max:255'],
            'ingredients.*.amount'   => ['nullable','string','max:255'],  // 225→255でもOK

            'steps'       => ['array'],
            'steps.*'     => ['required','string'],
        ]);

        if($request->hasFile('main_image')){
            $path = $request->file('main_image')->store('recipes','public');
            $recipe->main_image_path = $path;
        }

        $recipe->fill([
            'category_id'     => $validated['category_id'],
            'title'           => $validated['title'],
            'description'     => $validated['description'] ?? null,
            'servings'        => $validated['servings'] ?? null,
            'total_minutes'   => $validated['total_minutes'] ?? null,
        ])->save();

        $ids = $validated['tag_ids'] ?? [];
        $newIds = collect($validated['tag_names'] ?? [])
            ->map(fn($n) => trim($n))
            ->filter()
            ->map(function ($name) {
                $slug = Str::slug($name, '-');
                $tag  = Tag::firstOrCreate(['slug' => $slug], ['name' => $name]);
                return $tag->id;
            })->all();
        $recipe->tags()->sync(array_unique(array_merge($ids, $newIds)));    

        $recipe->ingredients()->delete();
        foreach (($validated['ingredients'] ?? []) as $i => $ing) {
            if (!trim($ing['name'] ?? '')) continue;    
            $recipe->ingredients()->create([
                'name'      => $ing['name'],
                'amount'    => $ing['amount'] ?? null,
                'position'  => $i + 1,
            ]); 
        }
        $recipe->steps()->delete();
        foreach (($validated['steps'] ?? []) as $i => $body) {  
            if (!trim($body ?? '')) continue;    
            $recipe->steps()->create([
                'body'      => $body,
                'position'  => $i + 1,
            ]); 
        }   
        
        return redirect()->route('recipes.show',$recipe->id)
            ->with('flash', ['type' => 'success', 'message' => 'レシピを更新しました']);
    }
}
