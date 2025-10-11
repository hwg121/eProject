<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSetting extends Model
{
    protected $fillable = [
        'email',
        'phone',
        'address',
        'website',
        'facebook',
        'instagram',
        'youtube',
        'linkedin',
        'working_hours',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the active contact settings
     */
    public static function getActive()
    {
        return static::where('is_active', true)->first();
    }
}
