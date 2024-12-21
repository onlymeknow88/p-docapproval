<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeritaAcara extends Model
{
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function beritaAcaraApp()
    {
        return $this->hasOne(BaApp::class,'DocNum','DocNum');
    }

    public function worksheetBa()
    {
        return $this->hasMany(WorksheetBa::class);
    }
}
