<?php

namespace App\Http\Controllers;

use App\Models\PengajuanSurat;
use App\Models\User; // Pastikan Model User di-import untuk menghitung total mahasiswa
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PengajuanSuratController extends Controller
{
    // 1. (Khusus Admin) Mengambil semua data pengajuan surat dari semua mahasiswa
    public function indexAdmin()
    {
        $pengajuan = PengajuanSurat::with('user')->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $pengajuan
        ], 200);
    }

    // 1.5. (Khusus Admin) Mengambil statistik dan pengajuan terbaru untuk Dashboard Admin
    public function dashboardStats()
    {
        $totalPengajuan = PengajuanSurat::count();
        $butuhDiproses = PengajuanSurat::where('status', 'Pending')->count();
        $suratSelesai = PengajuanSurat::where('status', 'Selesai')->count();
        
        // Menghitung jumlah user yang berperan sebagai mahasiswa (sesuaikan role jika ada di database)
        $totalMahasiswa = User::where('role', 'mahasiswa')->count(); 

        // Mengambil 5 pengajuan terbaru beserta relasi user-nya
        $pengajuanTerbaru = PengajuanSurat::with('user')
                            ->orderBy('created_at', 'desc')
                            ->take(5)
                            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_pengajuan' => $totalPengajuan,
                'butuh_diproses' => $butuhDiproses,
                'surat_selesai' => $suratSelesai,
                'total_mahasiswa' => $totalMahasiswa,
            ],
            'terbaru' => $pengajuanTerbaru
        ], 200);
    }

    // 2. (Khusus Mahasiswa) Mengambil data pengajuan milik mahasiswa yang sedang login
    public function indexMahasiswa(Request $request)
    {
        $pengajuan = PengajuanSurat::where('user_id', $request->user()->id)
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json([
            'success' => true,
            'data' => $pengajuan
        ], 200);
    }

    // 3. (Khusus Mahasiswa) Membuat pengajuan surat baru
    public function store(Request $request)
    {
        $request->validate([
            'jenis_surat' => 'required|string',
            'keperluan' => 'required|string',
            'lampiran' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $lampiranValue = null;
        
        // Menangkap file fisik yang diunggah dari frontend
        if ($request->hasFile('lampiran')) {
            $file = $request->file('lampiran');
            $originalName = $file->getClientOriginalName(); // Mendapatkan nama asli file
            $path = $file->store('lampiran_mahasiswa', 'public'); // Simpan file fisik
            
            // Gabungkan nama asli dan path dengan pemisah '|'
            $lampiranValue = $originalName . '|' . $path;
        }

        $pengajuan = PengajuanSurat::create([
            'user_id' => $request->user()->id,
            'jenis_surat' => $request->jenis_surat,
            'keperluan' => $request->keperluan,
            'lampiran' => $lampiranValue, // Menyimpan format "NamaAsli|Path" ke database
            'status' => 'Pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan surat berhasil dikirim!',
            'data' => $pengajuan
        ], 201);
    }

    // 4. (Khusus Admin) Mengupdate status surat
    public function updateStatus(Request $request, $id)
    {
        $pengajuan = PengajuanSurat::find($id);

        if (!$pengajuan) {
            return response()->json([
                'success' => false,
                'message' => 'Data pengajuan tidak ditemukan.'
            ], 404);
        }

        $pengajuan->update([
            'status' => $request->status ?? $pengajuan->status,
            'keterangan_admin' => $request->keterangan_admin ?? $pengajuan->keterangan_admin,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status surat berhasil diperbarui!',
            'data' => $pengajuan
        ], 200);
    }
}