<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuratController; // <- Jangan lupa panggil controller suratnya

// Rute Publik (Bisa diakses siapa saja tanpa token)
Route::post('/login', [AuthController::class, 'login']);

// Rute yang memerlukan autentikasi Sanctum
Route::middleware('auth:sanctum')->group(function () {
    
    // Rute khusus Admin (Mendaftarkan mahasiswa)
    Route::post('/admin/register-mahasiswa', [AuthController::class, 'registerMahasiswa']);
    
    // Rute Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Cek user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- Rute Pengajuan Surat ---
    // Mahasiswa mengajukan surat
    Route::post('/surat/ajukan', [SuratController::class, 'ajukan']);

    // Admin melihat semua surat
    Route::get('/surat', [SuratController::class, 'index']);

    // Admin mengubah status surat (disetujui / ditolak)
    Route::put('/surat/{id}/status', [SuratController::class, 'updateStatus']);
});