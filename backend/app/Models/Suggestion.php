<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'featured_image',
        'category',
        'difficulty_level',
        'season',
        'plant_type',
        'estimated_time',
        'rating',
        'views',
        'likes',
        'image',
        'tags',
        'is_featured',
        'is_published',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'rating' => 'decimal:1',
        'estimated_time' => 'integer',
        'views' => 'integer',
        'likes' => 'integer',
    ];
}