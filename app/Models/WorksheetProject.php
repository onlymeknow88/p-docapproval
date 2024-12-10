<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorksheetProject extends Model
{
    protected $guarded = [];

    protected $primaryKey = 'id';

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        // Automatically generate a custom ID for the primary key when creating a new record
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = self::generateCustomId();
            }
        });
    }

    /**
     * Generate a custom ID in the format 'A1234', 'A1235', etc.
     *
     * @return string
     */
    protected static function generateCustomId()
    {
        // Get the last ID from the table, ordered by descending ID
        $lastId = self::orderBy('id', 'desc')->first()?->id;

        if ($lastId && preg_match('/A(\d+)/', $lastId, $matches)) {
            // Extract the number after 'A', increment it, and pad with leading zeros
            $nextNumber = str_pad(intval($matches[1]) + 1, 2, '0', STR_PAD_LEFT);
        } else {
            // If no matching ID found, start from A01
            $nextNumber = '01';
        }

        // Return the new ID with the prefix 'A'
        return 'A' . $nextNumber;
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    protected $casts = [
        'id' => 'string',
    ];
}
