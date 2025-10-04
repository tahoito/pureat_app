<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category; // ← これ大事！

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => '肉料理','image_url' => 'niku.jpeg'],
            ['name' => '魚料理', 'image_url' => 'sakana.jpeg'],
            ['name' => '野菜料理','image_url' => 'yasai.png'],
            ['name' => 'ご飯系','image_url' => 'gohan.jpeg'],
            ['name' => '麺類','image_url' => 'men.jpeg'],
            ['name' => 'スープ系','image_url' => 'soup.jpeg'],
            ['name' => 'サラダ','image_url' => 'salad.jpeg'],
            ['name' => 'スイーツ','image_url' => 'sweets.jpeg'],
            ['name' => 'その他','image_url' => 'others.jpeg'],
        ];

        foreach ($items as $idx => $i) {
            $i['sort_order'] = $idx + 1; // 1,2,3...
            \App\Models\Category::updateOrCreate(['name' => $i['name']], $i);
        }
    }
}
