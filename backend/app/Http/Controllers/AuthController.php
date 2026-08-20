<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Fungsi Register khusus Admin untuk mendaftarkan Mahasiswa
    public function registerMahasiswa(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'mahasiswa',
            'nim' => $request->nim ?? '-',
            'prodi' => $request->prodi ?? '-',
            'jenis_mhs' => $request->jenis_mhs ?? '-',
            'angkatan' => $request->angkatan ?? '-',
            'jenis_kelamin' => $request->jenis_kelamin ?? 'Laki-Laki',
            'dosen_wali' => $request->dosen_wali ?? '-',
            'ttl' => $request->ttl ?? '-',
            'alamat' => $request->alamat ?? '-',
            'status' => $request->status ?? 'Aktif',
        ]);

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Akun mahasiswa berhasil didaftarkan oleh admin!',
            'data' => $user
        ], 201);
    }

    // Fungsi Login untuk semua (Admin & Mahasiswa)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Email atau Password salah!'
            ], 401);
        }

        // Buat token Sanctum untuk user yang login
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Login berhasil!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role
        ], 200);
    }

    // Fungsi Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Berhasil logout!'
        ], 200);
    }

    // Fungsi untuk mengirim daftar mahasiswa ke frontend
    public function indexMahasiswa()
    {
        // Mengambil semua data user yang rolenya 'mahasiswa'
        $mahasiswa = \App\Models\User::where('role', 'mahasiswa')->get();
        
        return response()->json([
            'success' => true,
            'data' => $mahasiswa
        ], 200);
    }

    // Fungsi untuk menghapus data mahasiswa
    public function destroyMahasiswa($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Data mahasiswa tidak ditemukan.'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data mahasiswa berhasil dihapus.'
        ], 200);
    }

    // Fungsi untuk mengupdate/edit data mahasiswa (INI YANG BARU DITAMBAHKAN)
    public function updateMahasiswa(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Data mahasiswa tidak ditemukan.'
            ], 404);
        }

        $user->update([
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'nim' => $request->nim ?? $user->nim,
            'prodi' => $request->prodi ?? $user->prodi,
            'jenis_mhs' => $request->jenis_mhs ?? $user->jenis_mhs,
            'angkatan' => $request->angkatan ?? $user->angkatan,
            'jenis_kelamin' => $request->jenis_kelamin ?? $user->jenis_kelamin,
            'dosen_wali' => $request->dosen_wali ?? $user->dosen_wali,
            'ttl' => $request->ttl ?? $user->ttl,
            'alamat' => $request->alamat ?? $user->alamat,
            'status' => $request->status ?? $user->status,
        ]);

        // Kalau admin mengisi password baru di form edit, kita update juga passwordnya
        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data mahasiswa berhasil diperbarui.',
            'data' => $user
        ], 200);
    }
}