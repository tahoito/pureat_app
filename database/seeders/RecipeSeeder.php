<?php

namespace Database\Seeders;
use App\Models\Recipe;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Recipe::create([
            'user_id' => 1,
            'category_id' => 1,
            'title' => '簡単カレー',
            'description' => '忙しい日にぴったりの時短カレー',
            'main_image_path' => '/images/sample_curry.jpeg',
            'is_recommended' => true,
        ]);

        Recipe::create([
            'user_id' => 1,
            'category_id' => 2,
            'title' => '和風パスタ',
            'description' => '醤油ベースでさっぱりとした和風スパゲッティ',
            'main_image_path' => '/images/sample_pasta.webp',
            'is_recommended' => true,
        ]);
    }
}
