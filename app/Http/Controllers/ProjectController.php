<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EInvoice\Vendor;
use App\Http\Resources\VendorResource;
use App\Models\MasterLookupValue;

class ProjectController extends Controller
{
    public function Index()
    {

        return inertia('Project/Index', [
            'page_settings' => [
                'title' => 'Project',
                'subtitle' => 'Menampilkan semua data project'
            ],
            'vendors' => VendorResource::collection(Vendor::all()),
            'project_types' => MasterLookupValue::select('Text','Value')->where('Group','ProjectType')->get(),
            'units' => MasterLookupValue::select('Text','Value')->where('Group','Unit')->get()
        ]);
    }
}
