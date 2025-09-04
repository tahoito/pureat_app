<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;              // これ必要
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['時短','節約','簡単','朝食'] as $name) {
            $slug = Str::slug(mb_strtolower($name));
            Tag::firstOrCreate(['slug' => $slug], ['name' => $name]);
        }
    }
}
