<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Recipe;

class HomeController extends Controller
{
    public function index(Request $request)
    {
       
        $q         = trim((string) $request->query('q', ''));
        $tag       = $request->query('tag');
        $category  = $request->query('category'); // カラム or リレーションに合わせて調整
        $tab       = $request->query('tab', 'all');
        $perPage   = (int) $request->query('per_page', 12);
        $perPage   = max(1, min($perPage, 50)); // 安全な範囲に丸め
        
        if ($q !== '' || $tag || $category){
            $tab = 'all';
        }
       
        $categories = Category::orderBy('id')
            ->take(9)
            ->get(['id', 'name', 'image_url']);

        $tags = Tag::orderBy('name')
            ->get(['id', 'name', 'slug']);

        $recipes = Recipe::query()
            ->select(['id','title','description','total_minutes','is_recommended','main_image_path'])
            ->with(['tags:id,name,slug','category:id,name,slug',])
            ->when($tab === 'recommended', fn ($q) => $q->where('is_recommended', 1))
            ->when($q !== '', function (Builder $x) use ($q) {
                $query->where(function (Builder $x) use ($q) {
                    $x->where('title', 'LIKE', "%{$q}%")
                      ->orWhere('description', 'LIKE', "%{$q}%")
                      ->orWhereHas('ingredients', fn ($i) => $i->where('name', 'LIKE', "%{$q}%"))
                      ->orWhereHas('tags', fn ($t) => $t->where('name', 'LIKE', "%{$q}%"));
                });
            })

            ->when($tag, function ($query) use ($tag) {
                $query->whereHas('tags', function ($t) use ($tag) {
                    if (is_numeric($tag)) {
                        $t->where('id', (int) $tag);
                    } else {
                        $t->where('slug', $tag)->orWhere('name', $tag);
                    }
                });
            })
            ->when($category, function ($query) use ($category) {
                $query->where('category', function($c) use ($category){
                    if (is_numeric($category)){
                        $c->where('id',(int) $category);
                    }else{
                        $c->where('slug', $category)->orWhere('name',$category);
                    }
                });
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();

    
        return Inertia::render('Home/Index', [
            'categories' => $categories,
            'tags'       => $tags,
            'recipes'    => $recipes,
            'tab'        => $tab,
            'filters'    => [
                'q'         => $q,
                'tag'       => (string)$tag,
                'category'  => (string)$category,
                'per_page'  => $perPage,
            ],
        ]);
    }
}
