<?php 

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Category;   
use App\Models\Tag;
use App\Models\Recipe;   

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('')
            ->take(9)
            ->get(['id','name','image_url']);

        $tags = Tag::orderBy('name')
            ->get(['id','name','slug']);

        $tab = request('tab','all');

        $query = Recipe::select('id','title','description','is_recommended') 
            ->latest('id');
           
        if ($tab === 'recommended'){
            $query->where('is_recommended',1);
        }

        $recipes = $query->paginate(10)->withQueryString()
            ->through(function (Recipe $r) {
                return [
                    'id'             => $r->id,
                    'title'          => $r->title,
                    'description'    => $r->description,
                    'main_image'     => $r->main_image_path,
                    'is_recommended' => (bool) $r->is_recommended,
                ];
            });

        return Inertia::render('Home/Index',[
            'categories' => $categories,
            'tags' => $tags,
            'recipes' => $recipes,
            'tab' => request('tab','all'),
        ]);

    }

}

?>