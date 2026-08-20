<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PengajuanSuratController;
use App\Http\Controllers\Admin\MahasiswaController;
use App\Http\Controllers\Admin\KategoriController; // <-- 1. Import KategoriController di sini

// Rute untuk Admin mengelola mahasiswa (diberi proteksi auth sanctum)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/admin/mahasiswa', [MahasiswaController::class, 'store']);
});

// Rute Publik (Bisa diakses siapa saja tanpa token)
Route::post('/login', [AuthController::class, 'login']);

// Rute yang memerlukan autentikasi Sanctum
Route::middleware('auth:sanctum')->group(function () {
    
    // Rute khusus Admin (Mendaftarkan & Mengelola mahasiswa)
    Route::post('/admin/register-mahasiswa', [AuthController::class, 'registerMahasiswa']);
    Route::get('/admin/mahasiswa', [AuthController::class, 'indexMahasiswa']);
    Route::delete('/admin/mahasiswa/{id}', [AuthController::class, 'destroyMahasiswa']);
    Route::put('/admin/mahasiswa/{id}', [AuthController::class, 'updateMahasiswa']);
    
    // Rute Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Cek user yang sedang login & update profil
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // --- Rute Pengajuan Surat ---
    // Mahasiswa
    Route::post('/mahasiswa/surat', [PengajuanSuratController::class, 'store']); 
    Route::get('/mahasiswa/surat', [PengajuanSuratController::class, 'indexMahasiswa']); 

    // Admin
    Route::get('/admin/surat', [PengajuanSuratController::class, 'indexAdmin']); 
    Route::put('/admin/surat/{id}/status', [PengajuanSuratController::class, 'updateStatus']); 
    Route::get('/admin/dashboard-stats', [PengajuanSuratController::class, 'dashboardStats']);

    // --- 2. Rute Kategori Surat (Admin & Mahasiswa) ---
    Route::get('/kategori-surat', [KategoriController::class, 'index']); // Bisa diakses mahasiswa/admin untuk daftar pilihan
    Route::post('/admin/kategori-surat', [KategoriController::class, 'store']); // Admin tambah kategori
    Route::put('/admin/kategori-surat/{id}', [KategoriController::class, 'update']);
    Route::delete('/admin/kategori-surat/{id}', [KategoriController::class, 'destroy']); // Admin hapus kategori
});