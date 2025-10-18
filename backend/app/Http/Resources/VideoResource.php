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
            'deleted_at' => $this->deleted_at,
            'createdAt' => $this->created_at, // Frontend camelCase
            'updatedAt' => $this->updated_at, // Frontend camelCase
            
            // Tags relationship
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            
            // Author tracking
            'author_id' => $this->author_id,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            
            // Author relationship (User who owns the content)
            'authorUser' => $this->authorUser ? [
                'id' => $this->authorUser->id,
                'name' => $this->authorUser->name,
                'email' => $this->authorUser->email,
                'avatar' => $this->authorUser->avatar ?? null,
            ] : null,
            
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

