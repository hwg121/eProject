<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutUs extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'content',
        'image',
        'cover',
        'category',
        'status',
        'views',
        'likes',
        'rating',
        'is_featured',
        'mission',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'rating' => 'decimal:1',
        'views' => 'integer',
        'likes' => 'integer',
    ];
}
