<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MahasiswaController extends Controller
{
    // 1. Menampilkan semua daftar mahasiswa
    public function index()
    {
        $mahasiswa = User::where('role', 'mahasiswa')->get();
        return response()->json([
            'success' => true,
            'data' => $mahasiswa
        ]);
    }

    // 2. Admin membuat akun mahasiswa
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'nim' => 'required|string|unique:users,nim',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'nim' => $request->nim,
            'role' => 'mahasiswa',
            'password' => Hash::make($request->password), // Untuk login
            'plain_password' => $request->password,       // Untuk dilihat admin jika lupa
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Akun mahasiswa berhasil dibuat!',
            'data' => $user
        ], 201);
    }

    // 3. Admin menghapus akun mahasiswa
    public function destroy($id)
    {
        $user = User::where('role', 'mahasiswa')->findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun mahasiswa berhasil dihapus!'
        ]);
    }
}