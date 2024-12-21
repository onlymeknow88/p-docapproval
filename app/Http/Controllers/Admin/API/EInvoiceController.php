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

        if($request->search) {
            $vendor->where('UserName', 'like', '%'.$request->search.'%')
                ->orWhere('VendorName', 'like', '%'.$request->search.'%')
                ->orWhere('Email', 'like', '%'.$request->search.'%');
        }

        if($request->filter && $request->direction){
            $vendor->orderBy($request->filter, $request->direction);
        }

        return ResponseFormatter::success(
            $vendor->paginate($request->load ?? 10)
        );
    }
}
