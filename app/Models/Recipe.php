<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
    ];
    
    public function user(){ return $this->belongsTo(User::class);}
    public function category(){ return $this->belongsTo(category::class);}
    public function ingredients(){ return $this->hasMany(Ingredient::class)->orderBy('position');}
    public function steps(){ return $this->hasMany(Step::class)->orderBy('position');}
    public function tags(){ return $this->belongsToMany(Tag::class, 'recipe_tag');}


    public function getMainImagePathAttribute($value)
    {
        return $value ?: asset('images/placeholder.jpeg');
    }

    
    public function setMainImageAttribute($value)
    {
        $this->attributes['main_image'] = 
            str_starts_with((string)$value, 'public/')
                ? substr($value, 7) 
                : $value;
    }    
}
