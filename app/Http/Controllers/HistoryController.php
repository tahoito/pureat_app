<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ViewHistory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;


class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user,403);
        
        $histories = \App\Models\ViewHistory::with([
            'recipe' => fn($q) => $q->select('id','title','description','total_minutes','main_image_path','category_id'),
            'recipe.tags:id,name,slug',
            'recipe.category:id,name'
            ])
            ->where('user_id',$user->id)
            ->orderByDesc('viewed_at')
            ->paginate(12)
            ->through(function(\App\Models\ViewHistory $vh){
                $r = $vh->recipe;
                if (!$r){
                    return [
                        'history_id'     => $vh->id,
                        'id'             => null,
                        'title'          => '(削除されたレシピ)',
                        'tags'           => [],
                        'category'       => null,
                        'main_image_url' => null,
                        'viewed_at'      => optional($vh->viewed_at)->toDateTimeString(),
                    ];
                }
                return [
                    'history_id' => $vh->id,
                    'id'         => $r->id,
                    'title'      => $r->title,
                    'description'=> $r->description,
                    'total_minutes'=> $r->total_minutes,
                    'category'   => $r->category ?['id'=>$r->category->id,'name'=>$r->category->name]: null,
                    'tags'       => $r->tags->map(fn($t)=>['id'=>$t->id,'name'=>$t->name,'slug'=>$t->slug])->all(),
                    'main_image_url' => $r->main_image_url,
                    'viewed_at'  => optional($vh->viewed_at)->toDateTimeString(),
                ];
            })
            ->withQueryString();

        return Inertia::render('History/Index', [
            'recipes' => $histories,
        ]);
    }

    public function destroy(Request $request, int $recipeId)
    {
        $user = $request->user();
        ViewHistory::where('user_id',$user->id)->where('recipe_id',$recipeId)->delete();
        return back()->with('flash',[
            'type' => 'success',
            'message' => '履歴を削除しました',
        ]);
    }

    public function clear(Request $request)
    {
        $user = $request->user();
        ViewHistory::where('user_id',$user->id)->delete();
        return back()->with('flash',[
            'type' => 'success',
            'message' => '履歴をすべて削除しました',
        ]);
    }
}
