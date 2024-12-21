<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BeritaAcaraResource extends JsonResource
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
            'project_id' => $this->project_id,
            'BAType' => $this->BAType,
            'WorkProgressPercent' => $this->WorkProgressPercent,
            'ProgressValue' => $this->ProgressValue,
            'DocStatus' => $this->DocStatus,
            'CreatedBy' => $this->CreatedBy,
            'UpdatedBy' => $this->UpdatedBy,
            'DocNum' => $this->DocNum,
            'PONum' => $this->project->where('id', $this->project_id)->first()->PONum,
            'ProjectValue' => $this->project->where('id', $this->project_id)->first()->ProjectValue,
            'ProjectName' => $this->project->where('id', $this->project_id)->first()->ProjectName,
            'ProjectType' => $this->project->where('id', $this->project_id)->first()->ProjectType,
            'ApprovalStatus' =>  $this->beritaAcaraApp->where('DocNum', $this->DocNum)->first()->ApprovalStatus,
            'VendorName' => $this->project->vendor->first()->VendorName,
            'PICName' => $this->project->first()->PICName,
            'PICAddress' => $this->project->first()->PICAddress,
            'PICIdCardNo' => $this->project->first()->PICIdCardNo,
            'PICPosition' => $this->project->first()->PICPosition,
            'worksheet_ba' => $this->worksheetBa,
            'attachments' => $this->project->first()->attachments->map(function ($attachment) {
                return [
                    'id' => $attachment->id,
                    'AttchName' => $attachment->AttchName,
                    'UrlPath' => $attachment->UrlPath,
                    'SizeKB' => $attachment->SizeKB,
                    'NameType' => $attachment->NameType
                ];
            }),
        ];
    }
}
