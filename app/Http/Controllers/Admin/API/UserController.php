<?php

namespace App\Http\Controllers\Admin\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserSingleResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $data = User::query();

        if ($request->search) {
            $data->where('username', 'like', '%' . $request->search . '%')
                ->orWhere('name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        if ($request->filter && $request->direction) {
            $data->orderBy($request->filter, $request->direction);
        }

        if ($request->id) {
            $user = User::find($request->id);

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
                'name' => 'required',
                'username' => 'required',
                'password' => 'required',
                'email' => 'required',
            ], [
                'name.required' => 'Nama harus diisi',
                'username.required' => 'Username harus diisi',
                'password.required' => 'Password harus diisi',
                'email.required' => 'Email harus diisi',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'message' => 'Validation error',
                    'data' => $validator->errors()
                ], 422);
            }

            $data = $request->except('password');
            $data['password'] = Hash::make($request->password);

            $user = User::create($data);

            return ResponseFormatter::success($user, 'Data berhasil ditambahkan');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required',
                'username' => 'required',
                'email' => 'required',
            ], [
                'name.required' => 'Nama harus diisi',
                'username.required' => 'Username harus diisi',
                'email.required' => 'Email harus diisi',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => true,
                    'message' => 'Validation error',
                    'data' => $validator->errors()
                ], 422);
            }


            $data = $request->except('password');
            if ($request->password) {
                $data['password'] = Hash::make($request->password);
            }

            $user = User::find($id);
            $user->update($data);

            return ResponseFormatter::success($user, 'Data berhasil diubah');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }

    public function checkUsername(Request $request)
    {
        $user = User::where('username', $request->username)->first();    
        if ($user) {
            return response()->json([
                'error' => true,
                'message' => 'Validation error',
                'data' => 'Username sudah digunakan'
            ], 422);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::find($id);
            $user->delete();
            return ResponseFormatter::success($user, 'Data berhasil dihapus');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage());
        }
    }
}
