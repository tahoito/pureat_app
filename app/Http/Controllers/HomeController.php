<?php 

namespace App\Http\Controllers;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home/Index',[
            'categories' => [
                ['name' => '肉料理','icon'=>'🥩'],
                ['name' => '魚料理','icon'=>'🥩'],
                ['name' => '野菜料理','icon'=>'🥩'],
                ['name' => 'ご飯系','icon'=>'🥩'],
                ['name' => '麺類','icon'=>'🥩'],
                ['name' => 'スープ系','icon'=>'🥩'],
                ['name' => 'サラダ','icon'=>'🥩'],
                ['name' => 'スイーツ','icon'=>'🥩'],
                ['name' => 'その他','icon'=>'🥩'],
            ],
            'tag' => ['時短','節約','簡単','朝食'],
        ]);
    }

}

?>