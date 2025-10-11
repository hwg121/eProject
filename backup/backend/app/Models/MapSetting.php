<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MapSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'embed_url',
        'location_name',
        'address',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the active map setting
     */
    public static function getActive()
    {
        return self::where('is_active', 1)->first();
    }
}

