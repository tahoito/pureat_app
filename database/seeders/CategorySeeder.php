<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category; // ← これ大事！

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => '肉料理',   'image_url' => '/images/niku.jpeg'],
            ['name' => '魚料理',   'image_url' => '/images/sakana.jpeg'],
            ['name' => '野菜料理', 'image_url' => '/images/yasai.png'],
            ['name' => 'ご飯系',   'image_url' => '/images/gohan.jpeg'],
            ['name' => '麺類',     'image_url' => '/images/men.jpeg'],
            ['name' => 'スープ系', 'image_url' => '/images/soup.jpeg'],
            ['name' => 'サラダ',   'image_url' => '/images/salad.jpeg'],
            ['name' => 'スイーツ', 'image_url' => '/images/sweets.jpeg'],
            ['name' => 'その他',   'image_url' => '/images/others.jpeg'],
        ];

        foreach ($items as $i) {
            Category::firstOrCreate(['name' => $i['name']], $i); // => に直す
        }
    }
}
