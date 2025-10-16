<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'excerpt',
        'content',
        'featured_image',
        'featured_image_public_id',
        'cover',
        'cover_public_id',
        'video_url',
        'embed_url',
        'thumbnail',
        'thumbnail_public_id',
        'instructor',
        'category',
        'status',
        'views',
        'likes',
        'duration',
        'is_featured',
        'category_id',
        'author_id',
        'published_at',
        // Optional columns - will be added by migration
        'link',
        'thumbnail_url',
        'rating',
    ];


    protected $casts = [
        'is_featured' => 'boolean',
        'views' => 'integer',
        'likes' => 'integer',
        'duration' => 'integer',
        'rating' => 'decimal:2',
        'published_at' => 'datetime',
    ];

    /**
     * Get Cloudinary URL with transformations for featured image
     */
    public function getFeaturedImageUrlAttribute($transformations = null)
    {
        if (!$this->featured_image) {
            return null;
        }

        // If it's already a full URL, return as is
        if (str_starts_with($this->featured_image, 'http')) {
            return $this->featured_image;
        }

        // If we have public_id, construct URL with transformations
        if ($this->featured_image_public_id && $transformations) {
            return "https://res.cloudinary.com/" . config('cloudinary.cloud_name') . "/image/upload/{$transformations}/{$this->featured_image_public_id}";
        }

        return $this->featured_image;
    }

    /**
     * Get Cloudinary URL with transformations for thumbnail
     */
    public function getThumbnailUrlAttribute($transformations = null)
    {
        if (!$this->thumbnail) {
            return null;
        }

        if (str_starts_with($this->thumbnail, 'http')) {
            return $this->thumbnail;
        }

        if ($this->thumbnail_public_id && $transformations) {
            return "https://res.cloudinary.com/" . config('cloudinary.cloud_name') . "/image/upload/{$transformations}/{$this->thumbnail_public_id}";
        }

        return $this->thumbnail;
    }

    /**
     * Get Cloudinary URL with transformations for cover
     */
    public function getCoverUrlAttribute($transformations = null)
    {
        if (!$this->cover) {
            return null;
        }

        if (str_starts_with($this->cover, 'http')) {
            return $this->cover;
        }

        if ($this->cover_public_id && $transformations) {
            return "https://res.cloudinary.com/" . config('cloudinary.cloud_name') . "/image/upload/{$transformations}/{$this->cover_public_id}";
        }

        return $this->cover;
    }

    /**
     * Get the author that created this video.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the tags associated with this video.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}

