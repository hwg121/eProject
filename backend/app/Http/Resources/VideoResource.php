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
            'slug' => $this->slug ?? '',
            'description' => $this->description ?? '',
            'excerpt' => $this->excerpt ?? '',
            'content' => $this->content ?? '',
            'status' => $this->status ?? 'published',
            'category' => $this->category ?? 'Video',
            'instructor' => $this->instructor ?? '',
            'duration' => $this->duration ?? '',
            'video_url' => $this->video_url ?? '',
            'embed_url' => $this->embed_url ?? '',
            'thumbnail' => $this->thumbnail ?? '',
            'featured_image' => $this->featured_image ?? '',
            'views' => $this->views ?? 0,
            'likes' => $this->likes ?? 0,
            'rating' => is_numeric($this->rating ?? 0) ? (float) $this->rating : 0.0,
            'is_featured' => (bool) ($this->is_featured ?? false),
            'link' => $this->link ?? '',
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'createdAt' => $this->created_at, // Frontend camelCase
            'updatedAt' => $this->updated_at, // Frontend camelCase
            
            // Author relationship
            'author' => $this->whenLoaded('author', function () {
                return [
                    'id' => $this->author->id,
                    'name' => $this->author->name,
                    'email' => $this->author->email,
                    'role' => $this->author->role,
                ];
            }),
            
            // Tags relationship
            'tags' => TagResource::collection($this->whenLoaded('tags')),
        ];
    }
}

