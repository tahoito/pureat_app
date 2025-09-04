<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
    protected $fillable = [
        'recipe_id',
        'position',
        'body',
        'path_photo',
    ];
    public function recipe(){ return $this->belongsTo(Recipe::class);}
}
