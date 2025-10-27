<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Recipe;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        Recipe::create([
            'user_id' => 1,
            'category_id' => 4,
            'title' => '米粉と豆乳のカレー',
            'description' => '小麦・乳・砂糖不使用。スパイスと野菜の旨味で作るヘルシーカレー。',
            'main_image_path' => '/images/sample1.jpeg',
            'total_minutes' => 35,
            'is_recommended' => true,
        ]);

        Recipe::create([
            'user_id' => 1,
            'category_id' => 7,
            'title' => '豆腐ガトーショコラ',
            'description' => 'バターも砂糖も使わず、豆腐とココアでしっとり仕上げたヘルシースイーツ。',
            'main_image_path' => '/images/sample2.jpeg',
            'total_minutes' => 40,
            'is_recommended' => true,
        ]);

        Recipe::create([
            'user_id' => 1,
            'category_id' => 6,
            'title' => '野菜たっぷりスープ',
            'description' => '添加物を一切使わず、旬の野菜をじっくり煮込んだナチュラルスープ。',
            'main_image_path' => '/images/sample3.jpeg',
            'total_minutes' => 20,
            'is_recommended' => true,
        ]);
    }
}
