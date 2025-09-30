<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ToolResource extends JsonResource
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
            'usage' => $this->usage,
            'category' => $this->category,
            'price_range' => $this->price_range,
            'image' => $this->image,
            'video_url' => $this->video_url,
            'affiliate_link' => $this->affiliate_link,
            'rating' => $this->rating,
            'images' => $this->images_json ? json_decode($this->images_json, true) : [],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

