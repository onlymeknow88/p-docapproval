<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProjectVendorController extends Controller
{
    public function Index()
    {

        return inertia('Project/Index', [
            'page_settings' => [
                'title' => 'Project',
                'subtitle' => 'Menampilkan semua data project'
            ],
        ]);
    }
}
