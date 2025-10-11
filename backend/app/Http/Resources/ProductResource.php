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
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->name, // Frontend expects 'title'
            'slug' => $this->slug,
            'description' => $this->description,
            'category' => $this->category,
            'subcategory' => $this->subcategory ?? '', // Ensure always string
            'price' => $this->price ? (float) $this->price : 0.0, // Ensure always float
            'brand' => $this->brand,
            'material' => $this->material,
            'size' => $this->size,
            'color' => $this->color,
            'status' => $this->status,
            'is_featured' => (bool) $this->is_featured,
            'is_published' => (bool) $this->is_published,
            'views' => $this->views ?? 0,
            'likes' => $this->likes ?? 0,
            'rating' => is_numeric($this->rating) ? (float) $this->rating : 0.0,
            'link' => $this->link,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'createdAt' => $this->created_at, // Frontend camelCase
            'updatedAt' => $this->updated_at, // Frontend camelCase
        ];

        // Add category-specific fields
        switch ($this->category) {
            case 'book':
                $data['author'] = $this->author;
                $data['pages'] = $this->pages;
                $data['published_year'] = $this->published_year;
                break;
                
            case 'pot':
                $data['drainage_holes'] = $this->drainage_holes;
                break;
                
            case 'accessory':
                $data['is_waterproof'] = $this->is_waterproof;
                $data['is_durable'] = $this->is_durable;
                break;
                
            case 'suggestion':
                $data['difficulty_level'] = $this->difficulty_level;
                $data['season'] = $this->season;
                $data['plant_type'] = $this->plant_type;
                $data['estimated_time'] = $this->estimated_time;
                $data['tags'] = $this->tags;
                break;
        }

        return $data;
    }
}
