<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'content' => $this->content ?? $this->body, // Return content field for frontend
            'status' => $this->status ?? 'published',
            'category' => $this->category ?? 'Technique', // Return category string like Video
            'views' => $this->views ?? 0,
            'likes' => $this->likes ?? 0,
            'rating' => $this->rating ?? 0,
            'is_featured' => (bool) ($this->is_featured ?? false),
            'featured_image' => $this->featured_image,
            'cover' => $this->cover,
            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'authorUser' => $this->whenLoaded('authorUser', function () {
                return $this->authorUser ? [
                    'id' => $this->authorUser->id,
                    'name' => $this->authorUser->name,
                    'email' => $this->authorUser->email,
                    'avatar' => $this->authorUser->avatar ?? null,
                ] : null;
            }),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            
            // Audit tracking
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            
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

