<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'is_enabled' => $this->is_enabled,
            'message' => $this->message,
            'started_at' => $this->started_at,
            'estimated_end_at' => $this->estimated_end_at,
            'enabled_by' => $this->whenLoaded('enabledBy', function () {
                return [
                    'id' => $this->enabledBy->id,
                    'name' => $this->enabledBy->name,
                    'email' => $this->enabledBy->email,
                ];
            }),
        ];
    }
}

