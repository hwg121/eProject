<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SuggestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'content' => $this->content,
            'category' => $this->category,
            'difficulty_level' => $this->difficulty_level,
            'season' => $this->season,
            'plant_type' => $this->plant_type,
            'estimated_time' => $this->estimated_time,
            'rating' => $this->rating,
            'views' => $this->views,
            'likes' => $this->likes,
            'image' => $this->image,
            'tags' => $this->tags,
            'is_featured' => $this->is_featured,
            'is_published' => $this->is_published,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}