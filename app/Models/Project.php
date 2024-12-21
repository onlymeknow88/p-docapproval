<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $guarded = [];

    public function worksheetProjects()
    {
        return $this->hasMany(WorksheetProject::class);
    }

    public function vendor()
    {
        return $this->belongsTo(EInvoice\Vendor::class,'VendorId','VendorNo');
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

}
