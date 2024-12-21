<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'PONum' => $this->PONum,
            'ProjectName' => $this->ProjectName,
            'VendorId' => $this->VendorId,
            'Abbreviation' => $this->vendor->first()->Abbreviation,
            'VendorName' => $this->vendor->first()->VendorName,
            'ProjectValue' => $this->ProjectValue,
            'ProjectType' => $this->ProjectType,
            'DpValue' => $this->DpValue,
            'PICName' => $this->PICName,
            'PICIdCardNo' => $this->PICIdCardNo,
            'PICPosition' => $this->PICPosition,
            'PICAdrress' => $this->PICAdrress,
            'ExecutionTimeStart' => $this->ExecutionTimeStart,
            'ExecutionTimeEnd' => $this->ExecutionTimeEnd,
            'ValidityPeriodGuaranteeStart' => $this->ValidityPeriodGuaranteeStart,
            'ValidityPeriodGuaranteeEnd' => $this->ValidityPeriodGuaranteeEnd,
            'PRNum' => $this->PRNum,
            'DpValidityPeriodStart' => $this->DpValidityPeriodStart,
            'DpValidityPeriodEnd' => $this->DpValidityPeriodEnd,
            'worksheet_projects' => WorksheetProjectResource::collection($this->worksheetProjects),
            'CreatedBy' => $this->CreatedBy,
        ];
    }
}
