<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_hash',
        'page',
        'viewed_at',
        'meta_json',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
        'meta_json' => 'array',
    ];
}

