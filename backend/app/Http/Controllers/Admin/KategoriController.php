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
            'nama_kategori' => 'required|string|max:255|unique:kategori_surats,nama_kategori',
            'deskripsi'     => 'nullable|string',
        ]);

        $kategori = KategoriSurat::create([
            'nama_kategori' => $request->nama_kategori,
            'deskripsi'     => $request->deskripsi,
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
        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori_surats,nama_kategori,' . $id,
            'deskripsi'     => 'nullable|string',
        ]);

        $kategori = KategoriSurat::findOrFail($id);
        $kategori->update([
            'nama_kategori' => $request->nama_kategori,
            'deskripsi'     => $request->deskripsi,
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