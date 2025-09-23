<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EssentialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'name' => $this->name,
            'details' => $this->details_json ? json_decode($this->details_json, true) : [],
            'season' => $this->season,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
