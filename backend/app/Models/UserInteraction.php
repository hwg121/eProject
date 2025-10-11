<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserInteraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_ip',
        'user_id',
        'content_type',
        'content_id',
        'interaction_type',
        'value',
        'rating_value',
    ];

    protected $casts = [
        'rating_value' => 'decimal:1',
        'value' => 'integer',
    ];

    /**
     * Get the content type and ID as a single identifier
     */
    public function getContentIdentifierAttribute()
    {
        return $this->content_type . '_' . $this->content_id;
    }

    /**
     * Scope for likes
     */
    public function scopeLikes($query)
    {
        return $query->where('interaction_type', 'like')->where('value', 1);
    }

    /**
     * Scope for ratings
     */
    public function scopeRatings($query)
    {
        return $query->where('interaction_type', 'rating');
    }

    /**
     * Scope for specific content
     */
    public function scopeForContent($query, $contentType, $contentId)
    {
        return $query->where('content_type', $contentType)->where('content_id', $contentId);
    }

    /**
     * Scope for user (by IP or user ID)
     */
    public function scopeForUser($query, $userIp = null, $userId = null)
    {
        if ($userId) {
            return $query->where('user_id', $userId);
        } elseif ($userIp) {
            return $query->where('user_ip', $userIp);
        }
        return $query;
    }
}