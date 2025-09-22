<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;           
use Illuminate\Support\Str;            
use App\Models\{Recipe, Category, Tag, Ingredient, Step, ViewHistory, ShoppingListItem};

class ShoppingListController extends Controller
{

    public function index() {
        $items = ShoppingListItem::where('user_id', auth()->id())->get();
        return Inertia::render('ShoppingList/Index', ['items' => $items]);
    }
    
    public function add(Request $request)
    {
        $recipe = Recipe::findOrFail($request->recipe_id);
        foreach($recipe->ingredients as $ingredient){
            ShoppingListItem::create([
                'user_id' => auth()->id(),
                'recipe_id' => $recipe->id,
                'name' => $ingredient->name,
                'checked' => false,
            ]);
        }
        return back();
    }

    public function toggle($id){
        $item = ShoppingListItem::findOrFail($id);
        $item->checked = !$item->checked;
        $item->save();
        return back();
    }
}