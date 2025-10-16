<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->name, // Frontend expects 'title'
            'slug' => $this->slug ?? '',
            'description' => $this->description ?? '',
            'image' => $this->image ?? '',
            'category' => $this->category,
            'subcategory' => $this->subcategory ?? '',
            'price' => $this->price !== null && $this->price !== '' 
                ? (float) $this->price 
                : null,
            'brand' => $this->brand ?? '',
            'material' => $this->material ?? '',
            'size' => $this->size ?? '',
            'color' => $this->color ?? '',
            'status' => $this->status ?? 'published',
            'is_featured' => (bool) ($this->is_featured ?? false),
            'views' => $this->views ?? 0,
            'likes' => $this->likes ?? 0,
            'rating' => is_numeric($this->rating ?? 0) ? (float) $this->rating : 0.0,
            'link' => $this->link ?? '',
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'createdAt' => $this->created_at, // Frontend camelCase
            'updatedAt' => $this->updated_at, // Frontend camelCase
            
            // Book specific fields
            'author' => $this->author ?? '',
            'pages' => $this->pages ?? null,
            'published_year' => $this->published_year ?? null,
            
            // Pot specific fields
            'drainage_holes' => (bool) ($this->drainage_holes ?? false),
            
            // Accessory specific fields
            'is_waterproof' => (bool) ($this->is_waterproof ?? false),
            'is_durable' => (bool) ($this->is_durable ?? false),
            
            // Suggestion specific fields
            'difficulty_level' => $this->difficulty_level ?? '',
            'season' => $this->season ?? '',
            'plant_type' => $this->plant_type ?? '',
            'estimated_time' => $this->estimated_time ?? '',
            
            // Tags relationship
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            
            // Author tracking
            'author_id' => $this->author_id,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            
            // Author relationship (User who owns the content)
            'authorUser' => $this->whenLoaded('author', function () {
                return $this->author ? [
                    'id' => $this->author->id,
                    'name' => $this->author->name,
                    'email' => $this->author->email,
                    'avatar' => $this->author->avatar ?? null,
                ] : null;
            }),
            
            // Creator relationship
            'creator' => $this->whenLoaded('creator', function () {
                return $this->creator ? [
                    'id' => $this->creator->id,
                    'name' => $this->creator->name,
                ] : null;
            }),
            
            // Updater relationship
            'updater' => $this->whenLoaded('updater', function () {
                return $this->updater ? [
                    'id' => $this->updater->id,
                    'name' => $this->updater->name,
                ] : null;
            }),
        ];
    }
}
