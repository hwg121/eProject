<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'usage',
        'category',
        'price_range',
        'image',
        'video_url',
        'affiliate_link',
        'rating',
        'images_json',
    ];
}

