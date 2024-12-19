<?php
namespace App\Enums;

enum DocStatus: string
{
    case DRAFT = 'Draft';
    case SUBMITTED = 'Submitted';
    case APPROVED = 'Approved';
    case ONPROGRESS = 'OnProgress';
    case REJECTED = 'Rejected';
    case CANCELLED = 'Cancelled';

    public static function options(): array
    {
        return collect(self::cases())->map(fn($item)=> [
            'value' => $item->value,
            'label' => $item->name
        ])->values()->toArray();
    }
}
