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
        // --- クエリ取得 ---
        $q         = trim((string) $request->query('q', ''));
        $tag       = $request->query('tag');
        $category  = $request->query('category'); // カラム or リレーションに合わせて調整
        $tab       = $request->query('tab', 'all');
        $perPage   = (int) $request->query('per_page', 12);
        $perPage   = max(1, min($perPage, 50)); // 安全な範囲に丸め

        // --- サイドデータ ---
        $categories = Category::orderBy('id')
            ->take(9)
            ->get(['id', 'name', 'image_url']);

        $tags = Tag::orderBy('name')
            ->get(['id', 'name', 'slug']);

        // --- レシピ一覧（検索 / 絞り込み / タブ） ---
        $recipesQuery = Recipe::query()
            ->select(['id','title','description','total_minutes','is_recommended','main_image_path'])
            ->with(['tags:id,name'])
            ->when($tab === 'recommended', fn ($q) => $q->where('is_recommended', 1))
            ->when($q !== '', function ($qr) use ($q) {
                $qr->where(function (Builder $x) use ($q) {
                    $x->where('title', 'LIKE', "%{$q}%")
                      ->orWhere('description', 'LIKE', "%{$q}%")
                      ->orWhere('body', 'LIKE', "%{$q}%")
                      ->orWhereHas('ingredients', fn ($i) => $i->where('name', 'LIKE', "%{$q}%"))
                      ->orWhereHas('tags', fn ($t) => $t->where('name', 'LIKE', "%{$q}%"));
                });
            })
            ->when($tag, fn ($qr) => $qr->whereHas('tags', fn ($t) => $t->where('name', $tag)))
            // ここはDB設計に合わせて変更（例：category_id の場合は where('category_id', $categoryId)）
            ->when($category, fn ($qr) => $qr->where('category_name', $category))
            ->orderByDesc('id');

        $recipes = $recipesQuery
            ->paginate($perPage)
            ->withQueryString();

        // --- 返却 ---
        return Inertia::render('Home/Index', [
            'categories' => $categories,
            'tags'       => $tags,
            'recipes'    => $recipes,
            'tab'        => $tab,
            'filters'    => [
                'q'         => $q,
                'tag'       => $tag,
                'category'  => $category,
                'per_page'  => $perPage,
            ],
        ]);
    }
}
