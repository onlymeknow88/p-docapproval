<?php

namespace App\Http\Controllers\Admin\API;

use Illuminate\Http\Request;
use App\Models\EInvoice\Vendor;
use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;

class EInvoiceController extends Controller
{
    public function index(Request $request)
    {
        $vendor = Vendor::query();

        return ResponseFormatter::success(
            $vendor->paginate($request->load ?? 10)
        );
    }
}
