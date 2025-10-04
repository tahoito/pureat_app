<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Category extends Model
{
    protected $appends = ['image_src'];

    // sort_order を使うならここに追加
    protected $fillable = ['name', 'icon', 'image_url', 'sort_order'];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function recipes()
    {
        return $this->hasMany(Recipe::class);
    }

    public function getImageSrcAttribute(): string
    {
        $raw = (string) ($this->image_url ?? '');

        if ($raw === '') {
            return asset('images/placeholder.png');
        }

        if (preg_match('#^(https?:)?//#', $raw) || str_starts_with($raw, 'data:')) {
            return $raw;
        }

        $filename = ltrim($raw, '/');

        return asset('images/' . $filename);

    }
}
