<?php 

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Category;   
use App\Models\Tag;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home/Index',[
            'categories' => Category::orderBy('name')->take(9)->get(['name','image_url']),
            'tags' => Tag::orderBy('name')->get(['name','slug']),
        ]);
    }

}

?>