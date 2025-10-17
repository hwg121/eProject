<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceSetting extends Model
{
    protected $fillable = [
        'is_enabled',
        'message',
        'started_at',
        'estimated_end_at',
        'enabled_by',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'started_at' => 'datetime',
        'estimated_end_at' => 'datetime',
    ];

    /**
     * Get the user who enabled maintenance mode
     */
    public function enabledBy()
    {
        return $this->belongsTo(User::class, 'enabled_by');
    }

    /**
     * Get the current maintenance setting (singleton pattern)
     */
    public static function current()
    {
        return static::first() ?? static::create([
            'is_enabled' => false,
            'message' => 'We are currently performing scheduled maintenance. We will be back shortly.',
        ]);
    }
}

