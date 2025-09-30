<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accessory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'image',
        'category',
        'material',
        'size',
        'color',
        'brand',
        'is_waterproof',
        'is_durable',
    ];

    protected $casts = [
        'is_waterproof' => 'boolean',
        'is_durable' => 'boolean',
        'price' => 'decimal:2',
    ];
}