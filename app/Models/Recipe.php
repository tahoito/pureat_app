<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];
    
    public function user(){ return $this->belongsTo(User::class);}
    public function category(){ return $this->belongsTo(category::class);}
    public function ingredients(){ return $this->hasMany(Ingredient::class)->orderBy('position');}
    public function steps(){ return $this->hasMany(Step::class)->orderBy('position');}
    public function tags(){ return $this->belongsToMany(Tag::class, 'recipe_tag');}

}
