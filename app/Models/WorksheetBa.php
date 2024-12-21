<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorksheetBa extends Model
{
    protected $guarded = [];

    public function worksheetProjects()
    {
        return $this->hasOne(WorksheetProject::class,'id','worksheet_project_id');
    }
}
