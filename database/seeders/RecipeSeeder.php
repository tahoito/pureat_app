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
            'total_minutes' => 30,
            'is_recommended' => true,
        ]);

        Recipe::create([
            'user_id' => 1,
            'category_id' => 4,
            'title' => '和風パスタ',
            'description' => '醤油ベースでさっぱりとした和風スパゲッティ',
            'main_image_path' => '/images/sample_pasta.jpeg',
            'total_minutes' => 20,
            'is_recommended' => true,
        ]);

        Recipe::create([
            'user_id' => 1,
            'category_id' => 9,
            'title' => 'たこ焼き',
            'main_image_path' => '/images/takoyaki.jpeg',
            'total_minutes' => 25,
            'is_recommended' => true,
        ]);
    }
}
