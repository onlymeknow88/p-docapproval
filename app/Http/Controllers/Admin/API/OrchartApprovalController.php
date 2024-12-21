<?php

namespace App\Http\Controllers\Admin\API;

use Illuminate\Http\Request;
use App\Models\OrchartApproval;
use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class OrchartApprovalController extends Controller
{
    public function index(Request $request)
    {
        $data = OrchartApproval::query();

        if ($request->search) {
            $data->where('CompanyId', 'like', '%' . $request->search . '%')
                ->orWhere('Name', 'like', '%' . $request->search . '%');
        }

        if ($request->filter && $request->direction) {
            $data->orderBy($request->filter, $request->direction);
        }

        if ($request->id) {
            $user = OrchartApproval::find($request->id);

            ResponseFormatter::success(
                $user,
                'Data berhasil ditampilkan',
            );
        }

        return ResponseFormatter::success(
            $data->paginate($request->load ?? 10)
        );
    }

    public function store(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                // 'CompanyId' => 'required',
                // 'DeptId' => 'required',
                'Name' => 'required',
                'Email' => 'required',
                'Position' => 'required',
                // 'Checker' => 'required',
            ], [
                // 'CompanyId.required' => 'Company harus diisi',
                // 'DeptId.required' => 'Departemen harus diisi',
                'Name.required' => 'Nama harus diisi',
                'Email.required' => 'Email harus diisi',
                'Position.required' => 'Position harus diisi',
                // 'Checker.required' => 'Checker harus diisi',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'message' => 'Validation error',
                    'data' => $validator->errors()
                ], 422);
            }

            $data = $request->except('Checker');

            if ($request->Checker) {
                $data['Checker'] = implode('; ', $request->Checker);
            }

            $data['CreatedBy'] = auth('api')->check() ? auth('api')->user()->name : auth('api_vendor')->user()->name;

            $orchart = OrchartApproval::create($data);

            return ResponseFormatter::success($orchart, 'Data berhasil ditambahkan');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }

    public function update(Request $request,$id)
    {
        try {

            $validator = Validator::make($request->all(), [
                // 'CompanyId' => 'required',
                // 'DeptId' => 'required',
                'Name' => 'required',
                'Email' => 'required',
                'Position' => 'required',
                // 'Checker' => 'required',
            ], [
                // 'CompanyId.required' => 'Company harus diisi',
                // 'DeptId.required' => 'Departemen harus diisi',
                'Name.required' => 'Nama harus diisi',
                'Email.required' => 'Email harus diisi',
                'Position.required' => 'Position harus diisi',
                // 'Checker.required' => 'Checker harus diisi',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'message' => 'Validation error',
                    'data' => $validator->errors()
                ], 422);
            }

            $data = $request->except('Checker');

            if ($request->Checker) {
                $data['Checker'] = implode('; ', $request->Checker);
            }

            $data['CreatedBy'] = auth('api')->check() ? auth('api')->user()->name : auth('api_vendor')->user()->name;

            $orchart = OrchartApproval::find($id);
            $orchart->update($data);

            return ResponseFormatter::success($orchart, 'Data berhasil diubah');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $orchart = OrchartApproval::find($id);
            $orchart->delete();
            return ResponseFormatter::success($orchart, 'Data berhasil dihapus');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }
}
