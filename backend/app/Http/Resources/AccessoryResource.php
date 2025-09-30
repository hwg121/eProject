<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccessoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'image' => $this->image,
            'category' => $this->category,
            'material' => $this->material,
            'size' => $this->size,
            'color' => $this->color,
            'brand' => $this->brand,
            'is_waterproof' => $this->is_waterproof,
            'is_durable' => $this->is_durable,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}