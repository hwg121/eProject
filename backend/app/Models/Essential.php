<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Essential extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'slug',
        'description',
        'image',
        'cover',
        'content',
        'category',
        'status',
        'views',
        'likes',
        'brand',
        'material',
        'size',
        'color',
        'is_waterproof',
        'is_durable',
        'season',
    ];

    protected $casts = [
        'is_waterproof' => 'boolean',
        'is_durable' => 'boolean',
        'views' => 'integer',
        'likes' => 'integer',
    ];
}

