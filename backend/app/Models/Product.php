<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
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
        'rating'
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
}