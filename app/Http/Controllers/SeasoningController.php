<?php 

// app/Http/Controllers/SeasoningController.php
namespace App\Http\Controllers;

use App\Models\Seasoning;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeasoningController extends Controller
{
  public function index(Request $r){
    $q       = trim((string)$r->query('q',''));
    $genre   = $r->query('genre');              // 'shoyu'等 複数なら配列でもOK
    $safety  = $r->query('safety');             // 'safe'|'caution'|'ng'
    $altOnly = (bool)$r->query('alt_only');     // 代替あり
    $sort    = $r->query('sort','popular');     // popular|name|price|updated

    $items = Seasoning::query()
      ->where('is_published',true)
      ->when($q !== '', fn($x)=>$x->where(function($w) use($q){
        $w->where('name','like',"%{$q}%")
          ->orWhere('brand','like',"%{$q}%")
          ->orWhere('ingredients_text','like',"%{$q}%");
      }))
      ->when($genre, fn($x)=>$x->whereIn('genre',(array)$genre))
      ->when($safety === 'safe', fn($x)=>$x->where('gf',1)->where('df',1)->where('sf',1)->where('af',1))
      ->when($safety === 'caution', fn($x)=>$x->where(fn($w)=>$w->where('sf',0)->orWhere('af',0)))
      ->when($safety === 'ng', fn($x)=>$x->where(fn($w)=>$w->where('gf',0)->orWhere('df',0)))
      ->when($altOnly, fn($x)=>$x->whereNotNull('alternatives'))
      ->when($sort === 'name', fn($x)=>$x->orderBy('name'))
      ->when($sort === 'price', fn($x)=>$x->orderBy('price'))
      ->when($sort === 'updated', fn($x)=>$x->latest('updated_at'))
      ->when($sort === 'popular', fn($x)=>$x->latest('id'))
      ->select(['id','name','brand','slug','genre','price','image_path','gf','df','sf','af','quantity','quantity_unit'])
      ->paginate(12)->withQueryString();

    return Inertia::render('Seasoning/Index',[
      'items'=>$items,
      'filters'=>[
        'q'=>$q,'genre'=>$genre,'safety'=>$safety,'alt_only'=>$altOnly,'sort'=>$sort,
      ],
    ]);
  }

  public function show(Seasoning $seasoning){
    $seasoning->load(['recipes:id,title,main_image_path,total_minutes']);
    return Inertia::render('Seasoning/Show',[
      'item'=>[
        'id'=>$seasoning->id,
        'name'=>$seasoning->name,
        'brand'=>$seasoning->brand,
        'price'=>$seasoning->price,
        'image_path'=>$seasoning->image_path,
        'image_url'=>$seasoning->image_url,
        'shop_url'=>$seasoning->shop_url,
        'gf'=>$seasoning->gf,'df'=>$seasoning->df,'sf'=>$seasoning->sf,'af'=>$seasoning->af,
        'ingredients_text'=>$seasoning->ingredients_text,
        'description'=>$seasoning->description,
        'features'=>$seasoning->features,
        'alternatives'=>$seasoning->alternatives,
        'recipes'=>$seasoning->recipes->map(fn($r)=>[
          'id'=>$r->id,'title'=>$r->title,'image'=>$r->main_image_path, 'minutes'=>$r->total_minutes
        ]),
      ]
    ]);
  }

  public function toShopping(Request $r, Seasoning $seasoning){
    // 既存の shopping_list_items に突っ込む想定
    $r->user()->shoppingListItems()->updateOrCreate(
      ['kind'=>'seasoning','ref_id'=>$seasoning->id],
      ['name'=>$seasoning->name,'note'=>$seasoning->brand,'quantity'=>1]
    );
    return back()->with('flash',['type'=>'success','message'=>'買い物リストに追加したよ']);
  }
}
