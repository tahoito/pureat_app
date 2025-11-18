<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;           
use Illuminate\Support\Str;            
use App\Models\{Recipe, Category, Tag, Ingredient, Step, ShoppingListItem};

class ShoppingListController extends Controller
{

    public function index() {
        $items = ShoppingListItem::where('user_id', auth()->id())->get();
        return Inertia::render('ShoppingList/Index', ['items' => $items]);
    }
    
    public function add(Request $request)
    {
        // seasoning_id が送られた場合
        if ($request->has('seasoning_id')) {
            $seasoning = \App\Models\Seasoning::findOrFail($request->seasoning_id);
            ShoppingListItem::create([
                'user_id' => auth()->id(),
                'name' => $seasoning->name,
                'checked' => false,
                'quantity' => 1,
                'note' => $seasoning->brand,  // ブランド名をメモに
            ]);
            return response()->json(['ok' => true]);
        }

        // recipe_id が送られた場合（従来の動作）
        if ($request->has('recipe_id')) {
            $recipe = Recipe::findOrFail($request->recipe_id);
            foreach($recipe->ingredients as $ingredient){
                $item = ShoppingListItem::where('user_id', auth()->id())
                    ->where('name',$ingredient->name)
                    ->first();

                if($item){
                    $item->quantity = ($item->quantity ?? 1) + 1;
                    $item->checked = false;
                    $item->save();
               }else{
                    ShoppingListItem::create([
                        'user_id' => auth()->id(),
                        'recipe_id' => $recipe->id,
                        'name' => $ingredient->name,
                        'checked' => false,
                        'quantity' => 1,
                    ]);
               }
            }
            return response()->json(['ok' => true]);
        }

        return response()->json(['error' => 'Missing recipe_id or seasoning_id'], 400);
    }

    public function toggle($id){
        $item = ShoppingListItem::findOrFail($id);
        $item->checked = !$item->checked;
        $item->save();
        return back();
    }

    public function clear()
    {
        ShoppingListItem::where('user_id',auth()->id())->delete();
        return back();
    }
}