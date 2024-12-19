<?php

namespace App\Http\Controllers\API;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\EInvoice\Vendor;
use App\Models\WorksheetProject;
use App\Helpers\ResponseFormatter;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\WorksheetProjectResource;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $data = Project::query()->with('worksheetProjects');

        if ($request->search) {
            $data->where('PONum', 'like', '%' . $request->search . '%')
                ->orWhere('ProjectName', 'like', '%' . $request->search . '%')
                ->orWhere('VendorId', 'like', '%' . $request->search . '%')
                ->orWhere('PICName', 'like', '%' . $request->search . '%')
                ->orWhere('PICPosition', 'like', '%' . $request->search . '%');
        }

        if ($request->filter && $request->direction) {
            $data->orderBy($request->filter, $request->direction);
        }
        $paginatedData = $data->paginate($request->load ?? 10);

        return ResponseFormatter::success(
            $paginatedData,
            'Berhasil mengambil data',
            ProjectResource::class
        );
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                // Validate main project fields
                'PONum' => 'required|string',
                'ProjectName' => 'required|string',
                'VendorId' => 'required|integer',
                'ProjectValue' => 'required|numeric',

                // Validate worksheet_projects array
                'worksheet_projects' => 'required|array',
                'worksheet_projects.*.JobGroup' => 'required|string',
                'worksheet_projects.*.JobDescription' => 'required|string',
                'worksheet_projects.*.Unit' => 'required|string',
                'worksheet_projects.*.UnitPriceRP' => 'required|numeric',
                'worksheet_projects.*.Target' => 'required|integer|min:0',
            ], [
                // Custom error messages for main project fields
                'PONum.required' => 'PONum harus diisi',
                'ProjectName.required' => 'ProjectName harus diisi',
                'VendorId.required' => 'VendorId harus diisi',
                'ProjectValue.required' => 'ProjectValue harus diisi',

                // Custom error messages for worksheet_projects fields
                'worksheet_projects.required' => 'Worksheet projects harus diisi',
                'worksheet_projects.array' => 'Worksheet projects harus berupa array',
                'worksheet_projects.*.JobGroup.required' => 'JobGroup harus diisi',
                'worksheet_projects.*.JobDescription.required' => 'JobDescription harus diisi',
                'worksheet_projects.*.Unit.required' => 'Unit harus diisi',
                'worksheet_projects.*.UnitPriceRP.required' => 'UnitPriceRP harus diisi',
                'worksheet_projects.*.Target.required' => 'Target harus diisi',
                'worksheet_projects.*.Target.integer' => 'Target harus berupa angka',
            ]);

            // Check for validation errors
            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'message' => 'Validation error',
                    'data' => $validator->errors()
                ], 422);
            }



            $data = $request->except('VendorId', 'JobGroup', 'JobDescription', 'Unit', 'UnitPriceRP', 'Target','worksheet_projects');

            $vendor = Vendor::where('VendorNo', $request->VendorId)->first();

            if (!$vendor) {
                return ResponseFormatter::error(
                    'Vendor not found',
                    404
                );
            }

            $data['Abbreviation'] = $vendor->Abbreviation;
            $data['VendorId'] = $vendor->VendorNo;
            $data['CreatedBy'] = auth('api')->check() ? auth('api')->user()->name : auth('api_vendor')->user()->name;
            $data['UpdatedBy'] = auth('api')->check() ? auth('api')->user()->name : auth('api_vendor')->user()->name;

            // Create the main project
            $project = Project::create($data);

            // Initialize an array to store worksheet projects
            $worksheetProjects = [];

            // Loop through the worksheet_projects array in the request
            foreach ($request->worksheet_projects as $worksheet) {
                $worksheetProjects[] = WorksheetProject::create([
                    'project_id' => $project->id, // Use the ID of the created project
                    'JobGroup' => $worksheet['JobGroup'],
                    'JobDescription' => $worksheet['JobDescription'],
                    'Target' => $worksheet['Target'] === null ? 0 : $worksheet['Target'],
                    'Unit' => $worksheet['Unit'],
                    'UnitPriceRP' => $worksheet['UnitPriceRP'],
                    'CreatedBy' => auth('api')->check() ? auth('api')->user()->name : auth('api_vendor')->user()->name,
                    'UpdatedBy' => auth('api')->check() ? auth('api')->user()->name : auth('api_vendor')->user()->name,
                ]);
            }

            // Return result with both the main project and worksheet projects
            $result = [
                'project' => $project,
                'worksheetProjects' => $worksheetProjects, // Return the array of created worksheet projects
            ];



            return ResponseFormatter::success(
                $result,
                'Data berhasil ditambahkan',
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // $validator = Validator::make($request->all(), [
            //     // Validate main project fields
            //     'PONum' => 'required|string',
            //     'ProjectName' => 'required|string',
            //     'VendorId' => 'required|integer',
            //     'ProjectValue' => 'required|numeric',

            //     // Validate worksheet_projects array
            //     'worksheet_projects' => 'required|array',
            //     'worksheet_projects.*.JobGroup' => 'required|string',
            //     'worksheet_projects.*.JobDescription' => 'required|string',
            //     'worksheet_projects.*.Unit' => 'required|string',
            //     'worksheet_projects.*.UnitPriceRP' => 'required|numeric',
            //     'worksheet_projects.*.Target' => 'required|integer|min:0',
            // ], [
            //     // Custom error messages for main project fields
            //     'PONum.required' => 'PONum harus diisi',
            //     'ProjectName.required' => 'ProjectName harus diisi',
            //     'VendorId.required' => 'VendorId harus diisi',
            //     'ProjectValue.required' => 'ProjectValue harus diisi',

            //     // Custom error messages for worksheet_projects fields
                // 'worksheet_projects.required' => 'Worksheet projects harus diisi',
                // 'worksheet_projects.array' => 'Worksheet projects harus berupa array',
            //     'worksheet_projects.*.JobGroup.required' => 'JobGroup harus diisi',
            //     'worksheet_projects.*.JobDescription.required' => 'JobDescription harus diisi',
            //     'worksheet_projects.*.Unit.required' => 'Unit harus diisi',
            //     'worksheet_projects.*.UnitPriceRP.required' => 'UnitPriceRP harus diisi',
            //     'worksheet_projects.*.Target.required' => 'Target harus diisi',
            //     'worksheet_projects.*.Target.integer' => 'Target harus berupa angka',
            //     'worksheet_projects.*.Target.min' => 'Target tidak boleh kurang dari 0',
            // ]);

            // // Check for validation errors
            // if ($validator->fails()) {
            //     return response()->json([
            //         'error' => true,
            //         'message' => 'Validation error',
            //         'data' => $validator->errors()
            //     ], 422);
            // }


            $data = $request->except('VendorId', 'JobGroup', 'JobDescription', 'Unit', 'UnitPriceRP', 'Target','worksheet_projects');

            $vendor = Vendor::where('VendorNo', $request->VendorId)->first();

            if (!$vendor) {
                return ResponseFormatter::error(
                    'Vendor not found',
                    404
                );
            }

            $data['Abbreviation'] = $vendor->Abbreviation;
            $data['VendorId'] = $vendor->VendorNo;
            $data['CreatedBy'] = auth('api')->check() ? auth('api')->user()->name : auth('api_vendor')->user()->name;
            $data['UpdatedBy'] = auth('api')->check() ? auth('api')->user()->name : auth('api_vendor')->user()->name;

            // Create the main project
            $project = Project::find($id);
            $project->update($data);

            // Initialize an array to store worksheet projects
            $worksheetProjects = [];

            foreach ($request->worksheet_projects as $worksheet) {
                $worksheetProjects[] = WorksheetProject::updateOrCreate(
                    [
                        'project_id' => $project->id,
                        'JobGroup' => $worksheet['JobGroup'],
                    ],
                    [
                        'JobDescription' => $worksheet['JobDescription'],
                        'Target' => $worksheet['Target'] === null ? 0 : $worksheet['Target'],
                        'Unit' => $worksheet['Unit'],
                        'UnitPriceRP' => $worksheet['UnitPriceRP'],
                        'UpdatedBy' => auth('api')->check() ? auth('api')->user()->name : auth('api_vendor')->user()->name,
                        'CreatedBy' => $project->CreatedBy,
                    ]
                );
            }



            $result = [
                'project' => $project,
                'worksheetProjects' => $worksheetProjects,
            ];



            return ResponseFormatter::success(
                $result,
                'Data berhasil diupdate',
            );
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $project = Project::find($id);
            if (!$project) {
                return ResponseFormatter::error(null, 'Project not found', 404);
            }

            // Begin a transaction
            DB::beginTransaction();

            // Delete related worksheet projects
            WorksheetProject::where('project_id', $project->id)->delete();

            // Delete the project
            $project->delete();

            // Commit the transaction
            DB::commit();
            return ResponseFormatter::success($project, 'Data berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseFormatter::error($e->getMessage());
        }
    }


    public function worksheetDestroy($id)
    {
        try {
            $worksheet = WorksheetProject::where('id',$id)->first();
            $worksheet->delete();
            return ResponseFormatter::success($worksheet, 'Data Worksheet Project berhasil dihapus - '. $worksheet->id);
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }

}
