<?php

namespace App\Http\Controllers;

use App\Models\Surat;
use App\Models\User;
use App\Models\KategoriSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class SuratController extends Controller
{
    // Mahasiswa mengajukan surat (Support Multiple Files)
    public function ajukan(Request $request)
    {
        $request->validate([
            'jenis_surat' => 'required|string|max:255',
            'keperluan' => 'required|string',
            'tujuan_surat' => 'required|string', 
            'lampiran.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $lampiranValues = [];
        if ($request->hasFile('lampiran')) {
            foreach ($request->file('lampiran') as $file) {
                $originalName = $file->getClientOriginalName();
                $path = $file->store('lampiran_mahasiswa', 'public');
                $lampiranValues[] = $originalName . '|' . $path;
            }
        }

        $surat = Surat::create([
            'user_id' => Auth::id(),
            'jenis_surat' => $request->jenis_surat,
            'keperluan' => $request->keperluan,
            'tujuan_surat' => $request->tujuan_surat,
            'lampiran' => count($lampiranValues) > 0 ? json_encode($lampiranValues) : null,
            'status' => 'Pending',
        ]);

        return response()->json(['status' => 'sukses', 'data' => $surat], 201);
    }

    // Mahasiswa melihat riwayat suratnya sendiri
    public function indexMahasiswa(Request $request)
    {
        $surat = Surat::where('user_id', Auth::id())
                    ->orderBy('created_at', 'desc')
                    ->get();
                    
        return response()->json($surat, 200);
    }

    // Admin melihat semua surat
    public function index()
    {
        $surat = Surat::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($surat, 200);
    }

    // Admin mengubah status + Generate PDF Otomatis jika Selesai
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
            'alasan' => 'nullable|string',
        ]);

        $surat = Surat::with('user')->findOrFail($id);
        $surat->status = $request->status; 
        
        if ($request->status === 'Ditolak' || $request->status === 'ditolak') {
            $surat->alasan_penolakan = $request->alasan;
            $surat->file_hasil = null;
        } else {
            $surat->alasan_penolakan = null; 
        }

        // --- GENERATE PDF OTOMATIS SAAT STATUS SELESAI ---
        if ($request->status === 'Selesai' || $request->status === 'selesai') {
            $filename = 'Surat_' . $surat->id . '_' . time() . '.pdf';
            
            $kategori = KategoriSurat::where('nama_kategori', $surat->jenis_surat)->first();
            $kodeKategori = $kategori ? $kategori->kode_kategori : 'UMUM';

            $pdf = Pdf::loadView('admin.pdf_surat', compact('surat', 'kodeKategori'));
            
            Storage::put('public/surat_selesai/' . $filename, $pdf->output());
            $surat->file_hasil = $filename;
        }

        $surat->save();

        return response()->json([
            'status' => 'sukses', 
            'pesan' => 'Status berhasil diubah dan surat PDF berhasil digenerate otomatis!',
            'data' => $surat
        ]);
    }

    // Fungsi untuk Admin melakukan Preview PDF sebelum surat diselesaikan
    public function previewPdf($id)
    {
        $surat = Surat::with('user')->findOrFail($id);
        
        $kategori = KategoriSurat::where('nama_kategori', $surat->jenis_surat)->first();
        $kodeKategori = $kategori ? $kategori->kode_kategori : 'UMUM';

        $pdf = Pdf::loadView('admin.pdf_surat', compact('surat', 'kodeKategori'));
        return $pdf->stream('Preview_Surat_' . $surat->id . '.pdf');
    }

    // Mahasiswa mendownload surat yang sudah selesai
    public function downloadPdf($id)
    {
        $surat = Surat::findOrFail($id);

        if (!$surat->file_hasil) {
            return response()->json(['pesan' => 'File surat belum tersedia.'], 404);
        }

        $filePath = 'surat_selesai/' . $surat->file_hasil;

        if (!Storage::exists('public/' . $filePath)) {
            return response()->json(['pesan' => 'File fisik tidak ditemukan di server.'], 404);
        }

        return Storage::download('public/' . $filePath);
    }

    // Statistik & Data Ringkasan untuk Dashboard Admin
    public function dashboardStats()
    {
        $totalPengajuan = Surat::count();
        $butuhDiproses = Surat::whereIn('status', ['Pending', 'Diproses'])->count();
        $suratSelesai = Surat::where('status', 'Selesai')->count();
        $totalMahasiswa = User::where('role', 'mahasiswa')->count();
        
        $pengajuanTerbaru = Surat::with('user')->orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_pengajuan' => $totalPengajuan,
                'butuh_diproses' => $butuhDiproses,
                'surat_selesai' => $suratSelesai,
                'total_mahasiswa' => $totalMahasiswa
            ],
            'terbaru' => $pengajuanTerbaru
        ], 200);
    }

    // Mengambil daftar notifikasi surat masuk untuk Admin
    public function adminNotifications()
    {
        $surat = Surat::with('user')
                    ->orderBy('created_at', 'desc')
                    ->take(20)
                    ->get();

        $notifications = $surat->map(function ($item) {
            $mhsName = $item->user->name ?? 'Mahasiswa';
            $jenis = $item->jenis_surat ?? 'Surat Pengantar';
            
            if ($item->status === 'Pending') {
                $title = "Pengajuan Baru Masuk";
                $message = "{$mhsName} baru saja mengajukan {$jenis}.";
                $type = "warning";
            } elseif ($item->status === 'Diproses') {
                $title = "Surat Sedang Diproses";
                $message = "Pengajuan {$jenis} oleh {$mhsName} sedang diproses.";
                $type = "info";
            } elseif ($item->status === 'Selesai') {
                $title = "Surat Selesai";
                $message = "Pengajuan {$jenis} oleh {$mhsName} telah selesai.";
                $type = "success";
            } else {
                $title = "Surat Ditolak";
                $message = "Pengajuan {$jenis} oleh {$mhsName} ditolak.";
                $type = "danger";
            }

            return [
                'id' => $item->id,
                'status' => $item->status,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'created_at' => $item->created_at,
            ];
        });

        return response()->json($notifications, 200);
    }
}