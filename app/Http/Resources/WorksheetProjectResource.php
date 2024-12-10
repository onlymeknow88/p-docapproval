<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorksheetProjectResource extends JsonResource
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
            'JobGroup' => $this->JobGroup,
            'JobDescription' => $this->JobDescription,
            'Unit' => $this->Unit,
            'UnitPriceRP' => $this->UnitPriceRP,
            'Target' => $this->Target,
            'Invoice' => $this->Invoice,
            'Realisation' => $this->Realisation,
            'project_id' => $this->project_id
        ];
    }
}
