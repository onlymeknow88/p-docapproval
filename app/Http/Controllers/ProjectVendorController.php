<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\MasterLookupValue;
use App\Http\Resources\ProjectResource;

class ProjectVendorController extends Controller
{
    public function Index()
    {
        return inertia('ProjectVendor/Index', [
            'page_settings' => [
                'title' => 'Project Vendor',
                'subtitle' => 'Menampilkan semua data project vendor'
            ],
            'projects' => ProjectResource::collection(Project::all()),
            'ba_types' => MasterLookupValue::select('Text','Value')->where('Group','BAType')->get(),
            'companies' => MasterLookupValue::select('Text','Value')->where('Group','Company')->get()
        ]);
    }
}
