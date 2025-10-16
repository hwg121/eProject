<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'category',
        'subcategory',
        'price',
        'brand',
        'material',
        'size',
        'color',
        'author',
        'pages',
        'published_year',
        'drainage_holes',
        'is_waterproof',
        'is_durable',
        'difficulty_level',
        'season',
        'plant_type',
        'estimated_time',
        'link',
        'status',
        'is_featured',
        'views',
        'likes',
        'rating',
        'author_id',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'drainage_holes' => 'boolean',
        'is_waterproof' => 'boolean',
        'is_durable' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'rating' => 'decimal:2'
    ];

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Helper methods
    public function isTool()
    {
        return $this->category === 'tool';
    }

    public function isBook()
    {
        return $this->category === 'book';
    }

    public function isPot()
    {
        return $this->category === 'pot';
    }

    public function isAccessory()
    {
        return $this->category === 'accessory';
    }

    public function isSuggestion()
    {
        return $this->category === 'suggestion';
    }

    public function getDisplayLink()
    {
        return $this->link;
    }

    /**
     * Get the tags associated with this product.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Get the author (owner) of this product.
     * Named 'authorUser' to avoid conflict with 'author' column (book author name)
     */
    public function authorUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the user who created this product.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this product.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Boot method to auto-track created_by and updated_by.
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
        });
        
        static::updating(function ($model) {
            if (auth()->check()) {
                $model->updated_by = auth()->id();
            }
        });
    }
}