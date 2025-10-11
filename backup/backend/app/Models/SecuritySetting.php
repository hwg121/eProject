<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class SecuritySetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'description',
    ];

    /**
     * Get a security setting value by key
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a security setting value
     */
    public static function set(string $key, $value, ?string $description = null): void
    {
        static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'description' => $description,
            ]
        );
    }

    /**
     * Verify admin password
     */
    public static function verifyAdminPassword(string $password): bool
    {
        $hashedPassword = static::get('admin_verification_password');
        
        if (!$hashedPassword) {
            return false;
        }
        
        return Hash::check($password, $hashedPassword);
    }

    /**
     * Update admin password
     */
    public static function updateAdminPassword(string $newPassword): void
    {
        static::set(
            'admin_verification_password',
            Hash::make($newPassword),
            'Hashed password required for creating/editing admin users'
        );
    }
}
