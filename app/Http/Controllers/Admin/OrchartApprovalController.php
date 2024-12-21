<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrchartApprovalController extends Controller
{
    public function index()
    {
        return inertia('Admin/OrchartApproval/Index', [
            'page_settings' => [
                'title' => 'Orchart Approval',
                'subtitle' => 'Menampilkan semua data Orchart Approval'
            ],
        ]);
    }
}
