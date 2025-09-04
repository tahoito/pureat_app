<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name','icon','image_url'];
    public function recipes(){ return $this->hasMany(Recipe::class);}

}
