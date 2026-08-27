<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuratController; 
use App\Http\Controllers\Admin\MahasiswaController;
use App\Http\Controllers\Admin\KategoriController; 

// Rute untuk Admin mengelola mahasiswa (diberi proteksi auth sanctum)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/admin/mahasiswa', [MahasiswaController::class, 'store']);
});

// Rute Publik (Bisa diakses siapa saja tanpa token)
Route::post('/login', [AuthController::class, 'login']);

// Rute Preview PDF Surat (Admin) - Diletakkan di luar Sanctum agar bisa dibuka langsung via window.open()
Route::get('/admin/surat/{id}/preview', [SuratController::class, 'previewPdf']);

// Rute yang memerlukan autentikasi Sanctum
Route::middleware('auth:sanctum')->group(function () {
    
    // Rute khusus Admin (Mendaftarkan, Mengelola, & Import data mahasiswa)
    Route::post('/admin/register-mahasiswa', [AuthController::class, 'registerMahasiswa']);
    Route::get('/admin/mahasiswa', [AuthController::class, 'indexMahasiswa']);
    Route::delete('/admin/mahasiswa/{id}', [AuthController::class, 'destroyMahasiswa']);
    Route::put('/admin/mahasiswa/{id}', [AuthController::class, 'updateMahasiswa']);
    
    // 🟢 Rute Import Data Mahasiswa (Baru ditambahkan di sini)
    Route::post('/admin/mahasiswa/import', [MahasiswaController::class, 'importMahasiswa']);
    
    // Rute Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Cek user yang sedang login & update profil
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // --- Rute Pengajuan Surat ---
    // Mahasiswa
    Route::post('/mahasiswa/surat', [SuratController::class, 'ajukan']); 
    Route::get('/mahasiswa/surat', [SuratController::class, 'indexMahasiswa']); 

    // Rute Download PDF
    Route::get('/surat/{id}/download', [SuratController::class, 'downloadPdf']);

    // Admin
    Route::get('/admin/surat', [SuratController::class, 'index']); 
    
    // Status Surat (POST untuk mendukung FormData & upload file / generate otomatis)
    Route::post('/admin/surat/{id}/status', [SuratController::class, 'updateStatus']); 
    
    // Rute Statistik & Notifikasi Dashboard Admin
    Route::get('/admin/dashboard-stats', [SuratController::class, 'dashboardStats']);
    Route::get('/admin/notifications', [SuratController::class, 'adminNotifications']);

    // --- Rute Kategori Surat (Admin & Mahasiswa) ---
    Route::get('/kategori-surat', [KategoriController::class, 'index']); 
    Route::post('/admin/kategori-surat', [KategoriController::class, 'store']); 
    Route::put('/admin/kategori-surat/{id}', [KategoriController::class, 'update']);
    Route::delete('/admin/kategori-surat/{id}', [KategoriController::class, 'destroy']); 
});