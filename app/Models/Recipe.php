<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Recipe extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'servings',
        'total_minutes',
        'main_image_path',   
        'is_favorite',
        'is_recommended',
        'amount',
    ];

   
    protected $appends = ['main_image_url'];


    public function user()     { return $this->belongsTo(User::class); }
    public function category() { return $this->belongsTo(Category::class); } // ← 大文字に
    public function ingredients(){ return $this->hasMany(Ingredient::class)->orderBy('position'); }
    public function steps()    { return $this->hasMany(Step::class)->orderBy('position'); }
    public function tags()     { return $this->belongsToMany(Tag::class, 'recipe_tag'); }
    public function favoriters(){ return $this->belongsToMany(User::class, 'favorites')->withTimestamps(); }

   
    public function getMainImageUrlAttribute(): ?string
    {
       
        $candidates = [
            $this->attributes['thumbnail_url']     ?? null,
            $this->attributes['main_image']        ?? null,
            $this->attributes['main_image_path']   ?? null, // 相対パスが入る想定
        ];

        foreach ($candidates as $v) {
            if (!$v) continue;

          
            if (Str::startsWith($v, ['http://','https://','/'])) {
                return $v;
            }

            
            return Storage::url(ltrim($v, '/'));
        }

        return asset('images/placeholder.jpeg');
    }

    
    public function setMainImageAttribute($value): void
    {
        $this->attributes['main_image'] =
            str_starts_with((string)$value, 'public/')
                ? substr($value, 7) // public/ を外す → recipes/xxx
                : $value;
    }

}