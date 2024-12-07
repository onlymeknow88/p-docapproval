<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return inertia('Admin/User/Index', [
            'page_settings' => [
                'title' => 'User',
                'subtitle' => 'Menampilkan semua data user yang tersedia pada platform ini'
            ],
        ]);
    }

    
}
