<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seasoning;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SeasoningController extends Controller
{
    public function index(Request $r)
    {
        $q     = trim((string)$r->query('q', ''));
        $genre = $r->query('genre');
        $sort  = $r->query('sort', 'updated');
        $per   = (int)$r->query('per_page', 20);

        $items = Seasoning::query()
            ->when($q !== '', fn($x) => $x->where(function($w) use ($q){
                $w->where('name','like',"%{$q}%")
                  ->orWhere('brand','like',"%{$q}%")
                  ->orWhere('ingredients_text','like',"%{$q}%");
            }))
            ->when($genre, fn($x)=> $x->where('genre',$genre))
            ->when($sort === 'name', fn($x)=> $x->orderBy('name'))
            ->when($sort === 'price', fn($x)=> $x->orderBy('price'))
            ->when(!in_array($sort,['name','price']), fn($x)=> $x->latest('updated_at'))
            ->paginate($per)
            ->withQueryString();

        return Inertia::render('Admin/Seasonings/Index', [
            'items'   => $items,
            'filters' => compact('q','genre','sort','per'),
            'genres'  => ['soy sauce','miso','salt','vinegar','sweetener','oil','sauce', 
                            'spice', 'herb', 'broth', 'paste', 'condiment'],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Seasonings/Form', [
            'item'   => null,
            'genres' => ['soy sauce','miso','salt','vinegar','sweetener','oil','sauce', 
                            'spice', 'herb', 'broth', 'paste', 'condiment'],
        ]);
    }

    public function store(Request $r)
    {
        $v = $r->validate([
            'name'  => ['required','string','max:255'],
            'brand' => ['nullable','string','max:255'],
            'genre' => ['nullable','string','max:50'],
            'price' => ['nullable','integer','min:0'],
            'image' => ['nullable','image','max:5120'],
            'gf' => ['boolean'], 'df' => ['boolean'], 'sf' => ['boolean'], 'af' => ['boolean'],
            'ingredients_text' => ['nullable','string','max:2000'],
            'description'      => ['nullable','string','max:2000'],
            'is_published'     => ['boolean'],
            'quantity'      => ['nullable','integer','min:0'],
            'quantity_unit' => ['nullable','string','max:10'],
            'shop_url'      => ['nullable','url'],
            'features'      => ['nullable','string','max:2000'],
            'alternatives'  => ['nullable','string','max:2000'],
        ]);

        $path = $r->hasFile('image') ? $r->file('image')->store('seasonings','public') : null;

        // features と alternatives を配列に変換
        $features = $v['features'] 
            ? array_map('trim', array_filter(explode(',', $v['features'])))
            : [];
        $alternatives = $v['alternatives'] 
            ? array_map('trim', array_filter(explode(',', $v['alternatives'])))
            : [];

        Seasoning::create([
            'name' => $v['name'],
            'slug' => Str::slug($v['name']) ?: Str::random(8),
            'brand'=> $v['brand'] ?? null,
            'genre'=> $v['genre'] ?? null,
            'price'=> $v['price'] ?? null,
            'image_path' => $path,
            'gf' => (bool)($v['gf'] ?? true),
            'df' => (bool)($v['df'] ?? true),
            'sf' => (bool)($v['sf'] ?? true),
            'af' => (bool)($v['af'] ?? true),
            'ingredients_text' => $v['ingredients_text'] ?? null,
            'description'      => $v['description'] ?? null,
            'is_published'     => (bool)($v['is_published'] ?? true),
            'quantity'      => $v['quantity'] ?? null,
            'quantity_unit' => $v['quantity_unit'] ?? null,
            'shop_url'      => $v['shop_url'] ?? null,
            'features'      => $features,
            'alternatives'  => $alternatives,
        ]);

        return redirect()->route('admin.seasonings.index', status: 303)
            ->with('flash',['type'=>'success','message'=>'調味料を登録したよ']);
    }

    public function edit(Seasoning $seasoning)
    {
        return Inertia::render('Admin/Seasonings/Form', [
            'item'   => $seasoning,
            'genres' => ['soy sauce','miso','salt','vinegar','sweetener','oil','sauce', 
                            'spice', 'herb', 'broth', 'paste', 'condiment'],
        ]);
    }

    public function update(Request $r, Seasoning $seasoning)
    {
       
        $v = $r->validate([
            'name'  => ['required','string','max:255'],
            'brand' => ['nullable','string','max:255'],
            'genre' => ['nullable','string','max:50'],
            'price' => ['nullable','integer','min:0'],
            'image' => ['nullable','image','max:5120'],
            'gf' => ['boolean'], 'df' => ['boolean'], 'sf' => ['boolean'], 'af' => ['boolean'],
            'ingredients_text' => ['nullable','string','max:2000'],
            'description'      => ['nullable','string','max:2000'],
            'is_published'     => ['boolean'],
            'quantity'      => ['nullable','integer','min:0'],
            'quantity_unit' => ['nullable','string','max:10'],
            'shop_url'      => ['nullable','url'],
            'features'      => ['nullable','string','max:2000'],
            'alternatives'  => ['nullable','string','max:2000'],
        ]);

        if ($r->hasFile('image')) {
            $seasoning->image_path = $r->file('image')->store('seasonings','public');
        }

        // features と alternatives を配列に変換
        $v['features'] = $v['features'] 
            ? array_map('trim', array_filter(explode(',', $v['features'])))
            : [];
        $v['alternatives'] = $v['alternatives'] 
            ? array_map('trim', array_filter(explode(',', $v['alternatives'])))
            : [];

        $seasoning->fill($v);
        $seasoning->save();

        return redirect()->route('admin.seasonings.index', status: 303)
            ->with('flash',['type'=>'success','message'=>'調味料を更新したよ']);
    }

    public function destroy(Seasoning $seasoning)
    {
        $seasoning->delete(); // SoftDeletes運用ならモデル側で対応
        return back()->with('flash',['type'=>'success','message'=>'削除したよ']);
    }
}
