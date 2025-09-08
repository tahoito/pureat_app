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

    protected $appends = ['main_image_path'];

    public function getMainImagePathAttribute($value)
    {
        if (!empty($this->attributes['main_image'])){
            return asset(Storage::disk('public')->url($this->attributes['main_image']));
        }

        if (!empty($this->attributes['main_image_path'])){
            return asset(ltrim($this->attributes['main_image_path'],'/'));
        }
        
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
