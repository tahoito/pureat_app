<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;   // ← これが無いと今のエラーになる

class Seasoning extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','brand','slug','genre','price','volume','image_path','shop_url',
        'is_published','gf','df','sf','af','ingredients_text','description','features','alternatives',
        'quantity','quantity_unit',
    ];

    protected $casts = [
        'is_published' => 'bool',
        'gf' => 'bool', 'df' => 'bool', 'sf' => 'bool', 'af' => 'bool',
        'features' => 'array',
        'alternatives' => 'array',
    ];

    public function recipes()
    {
        return $this->belongsToMany(Recipe::class);
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image_path) return '/images/placeholder.jpeg';
        return str_starts_with($this->image_path, 'http')
            ? $this->image_path
            : \Storage::disk('public')->url($this->image_path);
    }
}
