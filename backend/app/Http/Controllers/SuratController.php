<?php

namespace App\Http\Controllers;

use App\Models\Surat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SuratController extends Controller
{
    // Mahasiswa mengajukan surat
    public function ajukan(Request $request)
    {
        $request->validate([
            'judul_surat' => 'required|string|max:255',
            'keperluan' => 'required|string',
        ]);

        $surat = Surat::create([
            'user_id' => Auth::id(),
            'judul_surat' => $request->judul_surat,
            'keperluan' => $request->keperluan,
            'status' => 'pending',
        ]);

        return response()->json(['status' => 'sukses', 'data' => $surat], 201);
    }

    // Admin melihat semua surat
    public function index()
    {
        return response()->json(Surat::with('user')->get(), 200);
    }

    // Admin menyetujui atau menolak surat
    public function updateStatus(Request $request, $id)
    {
        $surat = Surat::findOrFail($id);
        $surat->status = $request->status; // 'disetujui' atau 'ditolak'
        $surat->save();

        return response()->json(['status' => 'sukses', 'pesan' => 'Status surat diupdate!']);
    }
}