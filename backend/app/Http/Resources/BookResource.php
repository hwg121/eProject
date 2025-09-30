<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'author' => $this->author,
            'category' => $this->category,
            'price' => $this->price,
            'image' => $this->image,
            'rating' => $this->rating,
            'buyLink' => $this->buyLink,
            'borrowLink' => $this->borrowLink,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

