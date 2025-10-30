<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Seasoning;

class SeasoningSeeder extends Seeder
{
    public function run(): void
    {
        Seasoning::updateOrCreate(
            ['slug' => 'organic-tamari'],
            [
                'name' => '有機たまり醤油',
                'brand' => '〇〇醸造',
                'genre' => 'shoyu',
                'price' => 580,
                'volume' => '300ml',
                'image_path' => 'seasonings/tamari.jpg',
                'shop_url' => 'https://example.com/tamari',
                'gf' => true, 'df' => true, 'sf' => true, 'af' => true,
                'ingredients_text' => '有機大豆、食塩',
                'description' => '小麦不使用のたまり。旨味しっかりで煮物に最適。',
                'features' => ['木桶仕込み','有機JAS'],
                'alternatives' => [['label'=>'通常しょうゆ','slug'=>'regular-soy']],
                'is_published' => true,
            ]
        );

        Seasoning::updateOrCreate(
            ['slug' => 'rice-vinegar'],
            [
                'name' => '純米酢',
                'brand' => '△△酢造',
                'genre' => 'vinegar',
                'price' => 420,
                'volume' => '500ml',
                'image_path' => 'seasonings/rice_vinegar.jpg',
                'gf' => true, 'df' => true, 'sf' => true, 'af' => true,
                'ingredients_text' => '米（国産）',
                'description' => '酸味まろやか。和え物・酢飯に。',
                'features' => ['無添加'],
                'is_published' => true,
            ]
        );
    }
}
