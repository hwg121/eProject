<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'body',
        'content',
        'featured_image',
        'cover',
        'category', // Add category field (string: 'Technique', etc.)
        'category_id',
        'author_id',
        'published_at',
        'status',
        'views',
        'likes',
        'rating',
        'is_featured',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'views' => 'integer',
        'likes' => 'integer',
        'rating' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function authorUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Get the user who created this article.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this article.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Boot method to auto-track created_by, updated_by, and published_at.
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (auth()->check()) {
                $model->created_by = auth()->id();
                $model->updated_by = auth()->id();
                
                // Auto-set author_id if not provided
                if (!$model->author_id) {
                    $model->author_id = auth()->id();
                }
            }
            
            // Auto-set published_at when creating with published status
            if ($model->status === 'published' && !$model->published_at) {
                $model->published_at = now();
            }
        });
        
        static::updating(function ($model) {
            if (auth()->check()) {
                $model->updated_by = auth()->id();
                \Log::info('Article Model Observer - updating event:', [
                    'article_id' => $model->id,
                    'old_updated_by' => $model->getOriginal('updated_by'),
                    'new_updated_by' => auth()->id(),
                    'auth_user' => auth()->user()->name,
                ]);
            }
            
            // Auto-set published_at when status changes to published
            if ($model->isDirty('status') && $model->status === 'published' && !$model->published_at) {
                $model->published_at = now();
            }
        });
    }
}

