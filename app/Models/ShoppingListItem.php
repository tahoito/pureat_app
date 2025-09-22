<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoppingListItem extends Model
{
    protected $fillable = [
        'user_id',
        'recipe_id',
        'name',
        'checked',
        'quantity',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }

}
