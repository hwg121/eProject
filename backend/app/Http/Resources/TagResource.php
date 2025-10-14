<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TagResource extends JsonResource
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
            'slug' => $this->slug,
            'description' => $this->description,
            
            // Content counts (if loaded)
            'articles_count' => $this->when(isset($this->articles_count), $this->articles_count ?? 0),
            'videos_count' => $this->when(isset($this->videos_count), $this->videos_count ?? 0),
            'products_count' => $this->when(isset($this->products_count), $this->products_count ?? 0),
            'total_count' => $this->when(isset($this->total_count), $this->total_count ?? 0),
            
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
