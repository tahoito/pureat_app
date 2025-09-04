<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;              
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $names = ['時短','節約','簡単','朝食'];
        foreach($names as $name){
            $slug = Str::slug($name);
            if($slug === ''){
                $slug = md5($name);
            }
            Tag::updateOrCreate(
                ['name' => $name],
                ['slug' => $slug]
            );
        }
    }
}
