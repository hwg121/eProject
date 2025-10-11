<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'user_ip',
        'activity_type',
        'action',
        'entity_type',
        'entity_id',
        'entity_name',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that performed the activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for public activities (content-related)
     */
    public function scopePublicActivities($query)
    {
        return $query->where('activity_type', 'public')
            ->orderBy('created_at', 'desc');
    }

    /**
     * Scope for security activities (login, user management)
     */
    public function scopeSecurityActivities($query)
    {
        return $query->where('activity_type', 'security')
            ->orderBy('created_at', 'desc');
    }

    /**
     * Scope for recent activities
     */
    public function scopeRecent($query, $limit = 20)
    {
        return $query->orderBy('created_at', 'desc')
            ->limit($limit);
    }

    /**
     * Static method to log an activity
     */
    public static function log(
        $activityType,
        $action,
        $entityType = null,
        $entityId = null,
        $entityName = null,
        $description = null,
        $metadata = null,
        $userId = null,
        $userIp = null
    ) {
        $user = $userId ? User::find($userId) : auth()->user();
        
        // Get real public IP address if not provided
        if (!$userIp) {
            $userIp = request()->header('CF-Connecting-IP') ?? // Cloudflare
                     request()->header('X-Forwarded-For') ??  // Load balancer
                     request()->header('X-Real-IP') ??        // Nginx proxy
                     request()->ip();                         // Fallback
            
            // Handle comma-separated IPs (X-Forwarded-For can have multiple)
            $userIp = explode(',', $userIp)[0];
            $userIp = trim($userIp);
        }
        
        return self::create([
            'user_id' => $user ? $user->id : null,
            'user_name' => $user ? $user->name : 'Guest',
            'user_ip' => $userIp,
            'activity_type' => $activityType,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'entity_name' => $entityName,
            'description' => $description,
            'metadata' => $metadata,
        ]);
    }

    /**
     * Log a public activity (content-related)
     */
    public static function logPublic($action, $entityType, $entityId, $entityName, $description = null, $metadata = null)
    {
        return self::log('public', $action, $entityType, $entityId, $entityName, $description, $metadata);
    }

    /**
     * Log a security activity (authentication, user management)
     */
    public static function logSecurity($action, $description, $metadata = null, $entityType = null, $entityId = null, $entityName = null)
    {
        return self::log('security', $action, $entityType, $entityId, $entityName, $description, $metadata);
    }
}


