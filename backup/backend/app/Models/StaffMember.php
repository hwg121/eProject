<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'short_bio',
        'avatar',
        'avatar_public_id',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * Get active staff members ordered by display_order
     */
    public static function getActiveStaff($limit = 5)
    {
        return self::where('is_active', 1)
            ->orderBy('display_order', 'asc')
            ->limit($limit)
            ->get();
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Automatically set display_order when creating
        static::creating(function ($staffMember) {
            if (!$staffMember->display_order) {
                $maxOrder = self::max('display_order') ?? 0;
                $staffMember->display_order = $maxOrder + 1;
            }
        });
    }
}

