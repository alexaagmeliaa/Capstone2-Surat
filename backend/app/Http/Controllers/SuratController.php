<?php

namespace App\Http\Controllers;

use App\Models\Surat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SuratController extends Controller
{
    // 1. Mahasiswa mengajukan surat
    public function ajukan(Request $request)
    {
        $request->validate([
            'judul_surat' => 'required|string|max:255',
            'keperluan' => 'required|string',
        ]);

        $surat = Surat::create([
            'user_id' => Auth::id(), // Pastikan Frontend sudah mengirim token Login
            'judul_surat' => $request->judul_surat,
            'keperluan' => $request->keperluan,
            'status' => 'pending',
            // Menyimpan tanggal secara real-time langsung dari mesin server (Backend)
            'tanggal_pengajuan' => now(), 
        ]);

        return response()->json(['status' => 'sukses', 'data' => $surat], 201);
    }

    // 2. Admin melihat semua surat
    public function index()
    {
        // Menampilkan data beserta info mahasiswanya, diurutkan dari yang paling baru
        $surat = Surat::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($surat, 200);
    }

    // 3. Admin menyetujui atau menolak surat (TERMASUK REVISI DOSEN)
    public function updateStatus(Request $request, $id)
    {
        // Validasi inputan admin
        $request->validate([
            'status' => 'required|in:disetujui,ditolak',
            'alasan' => 'nullable|string' // Alasan akan dikirim dari frontend
        ]);

        $surat = Surat::findOrFail($id);
        $surat->status = $request->status; 
        
        // Logika untuk menyimpan alasan penolakan jika status ditolak
        if ($request->status === 'ditolak') {
            $surat->alasan_penolakan = $request->alasan;
        } else {
            // Jika disetujui, pastikan kolom alasan kosong
            $surat->alasan_penolakan = null; 
        }

        $surat->save();

        return response()->json([
            'status' => 'sukses', 
            'pesan' => 'Status surat berhasil diupdate!',
            'data' => $surat
        ]);
    }
}