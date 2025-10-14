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
            
            // Tags relationship
            'tags' => TagResource::collection($this->whenLoaded('tags')),
        ];
    }
}
