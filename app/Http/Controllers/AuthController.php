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
            'role' => 'mahasiswa', // Otomatis diset sebagai mahasiswa
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
}