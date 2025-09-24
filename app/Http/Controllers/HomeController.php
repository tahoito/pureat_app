<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Recipe;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $q         = trim((string) $request->query('q', ''));
        $tag       = $request->query('tag');
        $category  = $request->query('category');
        $tab       = $request->query('tab', 'all');
        $perPage   = (int) $request->query('per_page', 12);
        $perPage   = max(1, min($perPage, 50));

        if ($q !== '' || $tag || $category) {
            $tab = 'all';
        }

        // --------------------
        // カテゴリ & タグ
        // --------------------
        $categories = Category::orderBy('id')
            ->take(9)
            ->get(['id','name','slug','image_url']);

        $tags = Tag::orderBy('name')->get(['id','name','slug']);

        // --------------------
        // 通常レシピ一覧
        // --------------------
        $recipes = Recipe::query()
            ->where('user_id',auth()->id())
            ->select(['id','title','description','total_minutes','main_image_path'])
            ->with(['tags:id,name,slug','category:id,name,slug'])
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($x) use ($q) {
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
                $query->whereHas('category', function($c) use ($category) {
                    if (is_numeric($category)) {
                        $c->where('id',(int)$category);
                    } else {
                        $c->where('slug', $category)->orWhere('name',$category);
                    }
                });
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();

        // --------------------
        // おすすめレシピ（スコア計算）
        // --------------------
        // RecipeController@index

        $all = Recipe::where('user_id',auth()->id())
            ->with(['tags:id,name,slug','category:id,name,slug'])
            ->withCount([
                'favoriters as favorites_count',
                'viewHistories as recent_views' => fn($q) =>
                    $q->where('viewed_at','>=',now()->subDays(30)),
            ])
            ->get();

        // タグの利用回数を数える
        $tagUseCount = collect();
        foreach ($all as $r) {
            foreach ($r->tags as $t) {
                $tagUseCount[$t->id] = ($tagUseCount[$t->id] ?? 0) + 1;
            }
        }
        $maxTagUse = $tagUseCount->max() ?: 1;

        // スコア付与
        $recommended = $all->map(function($r) use ($tagUseCount, $maxTagUse) {
            $score = 0;
            $score += $r->favorites_count * 5; // お気に入りの多さ
            $score += min(20, $r->recent_views * 3); // 最近の閲覧
            if ($r->created_at >= now()->subDays(14)) $score += 10; // 新しさ
            if ($r->is_recommended) $score += 15; // 管理者が手動でおすすめフラグ

            if ($r->tags->count()) {
                $sum = 0;
                foreach ($r->tags as $t) {
                    $use = (int)($tagUseCount[$t->id] ?? 0);
                    $sum += $use / $maxTagUse;
                }
                $score += (int) round(($sum / $r->tags->count()) * 15);
            }

            $r->recommend_score = $score;
            return $r;
        })
        ->sortByDesc('recommend_score')
        ->take(8) // 上位8件だけ出す
        ->values();
        
        return Inertia::render('Home/Index', [
            'categories'  => $categories,
            'tags'        => $tags,
            'recipes'     => $recipes,
            'recommended' => $recommended,
            'tab'         => $tab,
            'filters'     => [
                'q'         => $q,
                'tag'       => (string)$tag,
                'category'  => (string)$category,
                'per_page'  => $perPage,
            ],
        ]);
    }
}
