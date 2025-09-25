<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PotResource extends JsonResource
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
            'material' => $this->material,
            'size' => $this->size,
            'drainage_holes' => $this->drainage_holes,
            'color' => $this->color,
            'brand' => $this->brand,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

