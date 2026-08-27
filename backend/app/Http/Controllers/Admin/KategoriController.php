<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KategoriSurat;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    // Menampilkan semua kategori
    public function index()
    {
        $kategori = KategoriSurat::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $kategori
        ], 200);
    }

    // Admin menambah kategori baru
    public function store(Request $request)
    {
        $request->validate([
            'kode_kategori'  => 'required|string|max:50|unique:kategori_surats,kode_kategori',
            'nama_kategori'  => 'required|string|max:255',
            'jenis_kategori' => 'nullable|string|max:100',
            'deskripsi'      => 'nullable|string',
            'status'         => 'boolean',
        ]);

        $kategori = KategoriSurat::create([
            'kode_kategori'  => $request->kode_kategori,
            'nama_kategori'  => $request->nama_kategori,
            'jenis_kategori' => $request->jenis_kategori,
            'deskripsi'      => $request->deskripsi,
            'status'         => $request->status ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kategori surat berhasil ditambahkan!',
            'data' => $kategori
        ], 201);
    }

    // Admin mengedit kategori
    public function update(Request $request, $id)
    {
        $kategori = KategoriSurat::findOrFail($id);

        $request->validate([
            'kode_kategori'  => 'required|string|max:50|unique:kategori_surats,kode_kategori,' . $id,
            'nama_kategori'  => 'required|string|max:255',
            'jenis_kategori' => 'nullable|string|max:100',
            'deskripsi'      => 'nullable|string',
            'status'         => 'boolean',
        ]);

        $kategori->update([
            'kode_kategori'  => $request->kode_kategori,
            'nama_kategori'  => $request->nama_kategori,
            'jenis_kategori' => $request->jenis_kategori,
            'deskripsi'      => $request->deskripsi,
            'status'         => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kategori surat berhasil diupdate!',
            'data' => $kategori
        ], 200);
    }

    // Admin menghapus kategori
    public function destroy($id)
    {
        $kategori = KategoriSurat::findOrFail($id);
        $kategori->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori surat berhasil dihapus!'
        ], 200);
    }
}