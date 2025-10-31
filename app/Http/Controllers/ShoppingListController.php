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