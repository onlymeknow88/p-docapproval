<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;

class EInvoiceController extends Controller
{
    public function index()
    {


        return inertia('Admin/EInvoice/Index', [
            'page_settings' => [
                'title' => 'Vendor',
                'subtitle' => 'Menampilkan semua data vendor yang tersedia pada platform ini'
            ],
        ]);
    }
}
