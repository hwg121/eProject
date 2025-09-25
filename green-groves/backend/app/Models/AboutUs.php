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
        'mission',
        'vision',
        'values',
        'team_members',
        'achievements',
        'contact_email',
        'contact_phone',
        'address',
        'social_links',
        'is_active',
    ];

    protected $casts = [
        'team_members' => 'array',
        'achievements' => 'array',
        'social_links' => 'array',
        'is_active' => 'boolean',
    ];
}
