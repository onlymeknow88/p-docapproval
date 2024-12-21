<?php

namespace App\Http\Controllers\API;

use App\Models\BaApp;
use App\Models\Project;
use App\Models\Attachment;
use App\Models\BeritaAcara;
use App\Models\WorksheetBa;
use Illuminate\Http\Request;
use App\Models\WorksheetProject;
use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\BeritaAcaraResource;
use LynX39\LaraPdfMerger\Facades\PdfMerger;
use App\Http\Resources\WorksheetProjectResource;

class ProjectVendorController extends Controller
{
    public function index(Request $request)
    {
        $authVendor = auth('api_vendor')->user();
        $data = BeritaAcara::query()->with(['project', 'beritaAcaraApp', 'worksheetBa', 'worksheetBa.worksheetProjects','project.attachments']);

        if ($request->search) {
            $data->where('DocNum', 'like', '%' . $request->search . '%');
        }

        if ($request->filter && $request->direction) {
            $data->orderBy($request->filter, $request->direction);
        }
        $paginatedData = $data->paginate($request->load ?? 10);

        return ResponseFormatter::success(
            $paginatedData,
            'Berhasil mengambil data',
            BeritaAcaraResource::class
        );
    }

    public function store(Request $request)
    {
        try {
            // $validator = Validator::make($request->all(), [
            //     // Validate main project fields
            //     'PONum' => 'required|string',
            //     'WorkProgressPercent' => 'required',
            //     'PICName' => 'required',
            //     'PICAddress' => 'required',
            //     'PICIdCardNo' => 'required',
            //     'PICPosition' => 'required',
            //     'BAType' => 'required',
            //     'Company' => 'required',
            //     'ProgressValue' => 'required',


            //     // Validate worksheet_projects array
            //     'worksheet_projects' => 'required|array',
            //     'worksheet_projects.*.JobGroup' => 'required|string',
            //     'worksheet_projects.*.JobDescription' => 'required|string',
            //     'worksheet_projects.*.Unit' => 'required|string',
            //     'worksheet_projects.*.UnitPriceRP' => 'required|numeric',
            // ], [
            //     // Custom error messages for main project fields
            //     'PONum.required' => 'PO No harus diisi',
            //     'ProjectName.required' => 'Project Name harus diisi',
            //     'ProjectValue.required' => 'ProjectValue harus diisi',
            //     'PICName.required' => 'PIC Name harus diisi',
            //     'PICAddress.required' => 'PIC Address harus diisi',
            //     'PICIdCardNo.required' => 'PIC Id Card No harus diisi',
            //     'PICPosition.required' => 'PIC Position harus diisi',
            //     'BAType.required' => 'BA Type harus diisi',
            //     'Company.required' => 'Company harus diisi',
            //     'ProgressValue.required' => 'Progress Value harus diisi',
            //     'WorkProgressPercent' => 'Progress Work Progress harus diisi',


            //     // Custom error messages for worksheet_projects fields
            //     'worksheet_projects.required' => 'Worksheet projects harus diisi',
            //     'worksheet_projects.array' => 'Worksheet projects harus berupa array',
            //     'worksheet_projects.*.JobGroup.required' => 'JobGroup harus diisi',
            //     'worksheet_projects.*.JobDescription.required' => 'JobDescription harus diisi',
            //     'worksheet_projects.*.Unit.required' => 'Unit harus diisi',
            //     'worksheet_projects.*.UnitPriceRP.required' => 'UnitPriceRP harus diisi',
            // ]);

            // // Check for validation errors
            // if ($validator->fails()) {
            //     return response()->json([
            //         'error' => true,
            //         'message' => 'Validation error',
            //         'data' => $validator->errors()
            //     ], 422);
            // }

            $type = $request->type;
            // $data = $request->except('Company', 'PICAddress', 'PICIdCardNo', 'PICPosition', 'PICName', 'ProjectName', 'PONum', 'ProjectValue', 'idProject', 'VendorName', 'WorkProgressPercent', 'ProgressValue', 'BAType', 'worksheet_projects');

            $project = Project::find($request->idProject);

            $project->update([
                'PICName' => $request->PICName,
                'PICPosition' => $request->PICPosition,
                'PICIdCardNo' => $request->PICIdCardNo,
                'PICAddress' => $request->PICAddress,
                'UpdatedBy' => auth('api_vendor')->user()->VendorNo
            ]);



            $projectName = collect(explode(' ', $project->ProjectName))
                ->map(function ($word) {
                    return substr($word, 0, 1);
                })
                ->implode('');

            $docNum = $request->Company . '/' . $request->BAType . '/' . $project->Abbreviation . '/' . $projectName . '/' . date('m') . '/' . date('y');

            $beritaAcara = BeritaAcara::create([
                'project_id' => $request->idProject,
                'BAType' => $request->BAType,
                'DocNum' => $docNum,
                'DocStatus' => $type,
                'ProgressValue' => $request->ProgressValue,
                'WorkProgressPercent' => $request->WorkProgressPercent,
                'CreatedBy' => auth('api_vendor')->user()->VendorNo
            ]);

            $beritaAcara->beritaAcaraApp()->create([
                'project_id' => $project->id,
                'ApprovalStatus' => $type == 'Submit' ? 'OnProgress' : 'Draft',
                'ApprovalName' => '-',
                'CreatedBy' => auth('api_vendor')->user()->VendorNo,
                'DocNum' => $docNum,
                'Approvers' => '-'
            ]);

            $worksheetProjects = [];
            $worksheetBA = [];

            if (!empty($request->worksheet_projects) && is_array($request->worksheet_projects)) {
                foreach ($request->worksheet_projects as $worksheet_project) {
                    // Update WorksheetProject
                    $worksheetProjects[] = WorksheetProject::where('id', $worksheet_project['id'])->update([
                        'Invoice' => $worksheet_project['Invoice'] ?? 0,
                        'Realisation' => $worksheet_project['Realisation'] ?? 0,
                        'UpdatedBy' => auth('api_vendor')->user()->VendorNo
                    ]);

                    // Create WorksheetBa
                    $worksheetBA[] = WorksheetBa::create([
                        'berita_acara_id' => $beritaAcara->id,
                        'worksheet_project_id' => $worksheet_project['id'],
                        'Invoice' => $worksheet_project['Invoice'] ?? 0,
                        'Realisation' => $worksheet_project['Realisation'] ?? 0,
                        'CreatedBy' => auth('api_vendor')->user()->VendorNo
                    ]);
                }
            }


            if ($project) {
                if ($type == 'Draft') {
                    // $beritaAcara->update([
                    //     'DocStatus' => 'Draft'
                    // ]);

                    $result = [
                        'project' => $project,
                        'berita_acara' => $beritaAcara,
                        'worksheet_project' => $worksheetProjects,
                        'worksheet_ba' => $worksheetBA,
                    ];

                    return ResponseFormatter::success($result, 'Data berhasil ditambahkan');
                } else if ($type == 'Submit') {



                    $result = [
                        'project' => $project,
                        'berita_acara' => $beritaAcara,
                        'worksheet_project' => $worksheetProjects,
                        'worksheet_ba' => $worksheetBA,
                    ];

                    return ResponseFormatter::success($result, 'Data berhasil ditambahkan dan disubmit for approval');
                }
            }
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }




    public function update(Request $request, $id)
    {
        try {
            $type = $request->type;
            $beritaAcara = BeritaAcara::find($request->idBeritaAcara);

            $project = Project::find($request->idProject);

            $project->update([
                'PICName' => $request->PICName,
                'PICPosition' => $request->PICPosition,
                'PICIdCardNo' => $request->PICIdCardNo,
                'PICAddress' => $request->PICAddress,
                'UpdatedBy' => auth('api_vendor')->user()->VendorNo
            ]);

            $projectName = collect(explode(' ', $project->ProjectName))
                ->map(function ($word) {
                    return substr($word, 0, 1);
                })
                ->implode('');

            $docNum = $request->PONum ? $request->Company . '/' . $request->BAType . '/' . $project->Abbreviation . '/' . $projectName . '/' . date('m') . '/' . date('y') : $beritaAcara;

            $beritaAcara->update([
                'project_id' => $project->id,
                'BAType' => $request->BAType,
                'DocNum' => $docNum,
                'ProgressValue' => $request->ProgressValue,
                'WorkProgressPercent' => $request->WorkProgressPercent,
                'DocStatus' => $type == 'Draft' ? 'Draft' : 'Submited',
                'CreatedBy' => auth('api_vendor')->user()->VendorNo
            ]);

            $beritaAcaraApp = BaApp::where('project_id', $project->id)->first();

            $beritaAcaraApp->update([
                'project_id' => $project->id,
                'ApprovalStatus' => $type == 'Draft' ? 'Draft' : 'OnProgress',
                'ApprovalName' => '-',
                'CreatedBy' => auth('api_vendor')->user()->VendorNo,
                'DocNum' => $docNum,
                'Approvers' => '-'
            ]);

            $worksheetProjects = [];
            $worksheetBA = [];
            foreach ($request->worksheet_bas as $worksheet_ba) {
                $worksheetProjects[] = WorksheetProject::where('id', $worksheet_ba['worksheet_project_id'])->update([
                    'Invoice' => $worksheet_ba['Invoice'] ?? 0,
                    'Realisation' => $worksheet_ba['Realisation'] ?? 0,
                    'UpdatedBy' => auth('api_vendor')->user()->VendorNo
                ]);

                $worksheetBA[] = WorksheetBa::updateOrCreate(
                    [
                        'worksheet_project_id' => $worksheet_ba['worksheet_project_id']
                    ],
                    [
                        'berita_acara_id' => $beritaAcara->id,
                        'Invoice' => $worksheet_ba['Invoice'] ?? 0,
                        'Realisation' => $worksheet_ba['Realisation'] ?? 0,
                        'CreatedBy' => auth('api_vendor')->user()->VendorNo
                    ]
                );
            }

            if ($project) {
                if ($type == 'Draft') {
                    // $beritaAcara->update([
                    //     'DocStatus' => 'Draft'
                    // ]);

                    $result = [
                        'project' => $project,
                        'berita_acara' => $beritaAcara,
                        'worksheet_project' => $worksheetProjects,
                        'worksheet_ba' => $worksheetBA,
                    ];

                    return ResponseFormatter::success($result, 'Data berhasil diupdate');
                } else if ($type == 'Submit') {
                        self::sendFileSubmitMerge($project->id);


                    $result = [
                        'project' => $project,
                        'berita_acara' => $beritaAcara,
                        'worksheet_project' => $worksheetProjects,
                        'worksheet_ba' => $worksheetBA,
                    ];

                    return ResponseFormatter::success($result, 'Data berhasil diupdate dan disubmit for approval');
                }
            }

        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
        return ResponseFormatter::success($request->all());
    }

    public function destroy($id)
    {
        try {
            $data = BeritaAcara::with(['project',  'worksheetBa'])->find($id);
            $data->project()->update([
                'PICName' => null,
                'PICAddress' => null,
                'PICPosition' => null,
                'PICIdCardNo' => null,
                'UpdatedBy' => auth('api_vendor')->user()->VendorNo
            ]);


            foreach ($data->worksheetBa as $item) {

                WorksheetProject::where('id', $item->worksheet_project_id)->update([
                    'Invoice' => 0,
                    'Realisation' => 0,
                    'UpdatedBy' => auth('api_vendor')->user()->VendorNo
                ]);
            }

            Attachment::where('project_id', $data->project_id)->delete();

            BaApp::where('DocNum', $data->DocNum)->first()->delete();
            $data->worksheetBa()->delete();

            $data->delete();
            return ResponseFormatter::success($data, 'Data berhasil di hapus');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }

    public function showProject($id)
    {
        $data = Project::with(['vendor', 'worksheetProjects'])->where('PONum', $id)->first();

        if ($data) {
            return ResponseFormatter::success(
                $data,
                'Berhasil mengambil data',
                ProjectResource::class
            );
        } else {
            return ResponseFormatter::error(null, 'Data not found', 404);
        }
    }

    public function worksheetIndex($id)
    {
        $data = WorksheetProject::where('project_id', $id)->get();
        if ($data) {
            return ResponseFormatter::success(
                $data,
                'Berhasil mengambil data',
                WorksheetProjectResource::class
            );
        } else {
            return ResponseFormatter::error(null, 'Data not found', 404);
        }
    }

    public function uploadFile(Request $request)
    {
        $result = [];
        if ($request->file('files')) {
            $id = $request->id;

            $url = 'https://prod-27.southeastasia.logic.azure.com:443/workflows/25d3b16b117a44b887319ced844a21c4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gIbC99bgncBb39ASEu3LR-dHuXHfwfmuQwHvLwPsJaE';

            $apiKey = '1c863928-f3db-4852-a2ae-e0d2a6a668bc';

            $project = Project::find($id);

            $beritaAcara = BeritaAcara::where('project_id', $id)->first();

            $folderPath = 'ApprovalDoc/BAPPBAST/' . date('y') . '/' . $project->VendorId . $project->Abbreviation . '/' . str_replace('/', '', $beritaAcara->DocNum);
            $folderTemp = '/uploads/' . $id . '/';

            $pdfMerger = PDFMerger::init();


            foreach ($request->file('files')  as $index => $file) {
                $filename = $file->getClientOriginalName();
                $nameType = $request->input('NameType')[$index] ?? null;

                // Use Http::attach for file uploads
                $response = Http::attach(
                    'fileContent',
                    file_get_contents($file->getPathname()),
                    $filename
                )->post($url, [
                    'apiKey' => $apiKey,
                    'fileName' => $filename,
                    'folderPath' => $folderPath,
                ]);

                // Check if the upload was successful
                if ($response->successful()) {
                    // Save to database only if upload was successful
                    $attachmentData = [
                        'NameType' => $nameType,
                        'project_id' => $id,
                        'SizeKB' => $response->json('FileSize'), // Calculate size in KB
                        'AttchName' => $filename,
                        'UrlPath' => $response->json('SpUrl') ?? '', // Assuming 'SpUrl' is part of the response
                        'CreatedBy' => auth('api_vendor')->user()->VendorNo,
                    ];

                    $result[] = Attachment::create($attachmentData);
                } else {
                    // Handle failed upload
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to upload file: ' . $filename,
                        'error' => $response->body(),
                    ], $response->status());
                }
                $tempFileName = 'temp_' . $index . '.pdf';
                $tempFilePath = storage_path('app/public/' . $folderTemp . $tempFileName);



                $file->storeAs($folderTemp, $tempFileName, 'public');

                // Add file to the PDF merger
                $pdfMerger->addPDF($tempFilePath, 'all');
            }


            $mergedFilePath = storage_path('app/public/uploads/mergePDF/Document_' . $project->PONum . '.pdf');

            $pdfMerger->merge();
            $pdfMerger->save($mergedFilePath);



            // Storage::deleteDirectory(storage_path('app/public/' . $folderTemp));
            // Optional: Clean up temporary files after merging
            foreach ($request->file('files') as $index => $file) {
                $tempFileName = 'temp_' . $index . '.pdf';
                $tempFilePath = storage_path('app/public/' . $folderTemp . $tempFileName);
                if (file_exists($tempFilePath)) {
                    unlink($tempFilePath);
                }
            }

        }
        return ResponseFormatter::success($result, 'Data berhasil di upload');
    }

    private static function sendFileSubmitMerge($id)
    {

        $project = Project::find($id);

        $beritaAcara = BeritaAcara::where('project_id', $id)->first();

        $url = 'https://prod-27.southeastasia.logic.azure.com:443/workflows/25d3b16b117a44b887319ced844a21c4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gIbC99bgncBb39ASEu3LR-dHuXHfwfmuQwHvLwPsJaE';

        $apiKey = '1c863928-f3db-4852-a2ae-e0d2a6a668bc';

        $path = storage_path('app/public/uploads/mergePDF/Document_' . $project->PONum . '.pdf');

        $folderPath = 'ApprovalDoc/BAPPBAST/' . date('y') . '/' . $project->VendorId . $project->Abbreviation . '/' . str_replace('/', '', $beritaAcara->DocNum);

        if (file_exists($path)) {
            $response =  Http::attach(
                'fileContent',
                file_get_contents($path),
                'Document_' . $project->PONum . '.pdf'
            )->post(
                $url,
                [
                    'apiKey' => $apiKey,
                    'fileName' => 'Dokumen_' . $project->BAType . '_' . $project->PONum . '.pdf',
                    'folderPath' => $folderPath
                ]
            );

            if ($response->successful()) {
                unlink($path);
            }
        }
    }

    public function deleteFile($id)
    {
        $attachment = Attachment::find($id);

        if (!$attachment) {
            return ResponseFormatter::error(null, 'Data not found', 404);
        }

        $attachment->delete();

        return ResponseFormatter::success(null, 'Data deleted successfully');
    }
}
