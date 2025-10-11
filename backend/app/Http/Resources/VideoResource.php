<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status ?? 'published',
            'embed_url' => $this->embed_url,
            'thumbnail' => $this->thumbnail,
            'views' => $this->views ?? 0,
            'likes' => $this->likes ?? 0,
            'rating' => $this->rating ?? 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

