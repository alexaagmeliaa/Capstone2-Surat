<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MahasiswaController extends Controller
{
    // 1. Menampilkan semua daftar mahasiswa
    public function index()
    {
        $mahasiswa = User::where('role', 'mahasiswa')->get();
        return response()->json([
            'success' => true,
            'data' => $mahasiswa
        ]);
    }

    // 2. Admin membuat akun mahasiswa secara manual
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'nim' => 'required|string|unique:users,nim',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'nim' => $request->nim,
            'role' => 'mahasiswa',
            'password' => Hash::make($request->password), // Untuk login
            'plain_password' => $request->password,      // Untuk dilihat admin jika lupa
            'prodi' => $request->prodi ?? '-',
            'jenis_mhs' => $request->jenis_mhs ?? 'Reguler',
            'angkatan' => $request->angkatan ?? '-',
            'jenis_kelamin' => $request->jenis_kelamin ?? 'Laki-Laki',
            'dosen_wali' => $request->dosen_wali ?? '-',
            'ttl' => $request->ttl ?? '-',
            'alamat' => $request->alamat ?? '-',
            'status' => $request->status ?? 'Aktif',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Akun mahasiswa berhasil dibuat!',
            'data' => $user
        ], 201);
    }

    // 3. Admin menghapus akun mahasiswa
    public function destroy($id)
    {
        $user = User::where('role', 'mahasiswa')->findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun mahasiswa berhasil dihapus!'
        ]);
    }

    // 4. 🟢 FUNGSI BARU: Import Data Mahasiswa secara massal via file CSV/Excel
    public function importMahasiswa(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls'
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        $data = array_map('str_getcsv', file($path));
        
        if (empty($data) || count($data) < 2) {
            return response()->json([
                'success' => false,
                'message' => 'File kosong atau format data tidak valid.'
            ], 400);
        }

        $header = array_shift($data); // Baris pertama sebagai header kolom
        $successCount = 0;
        $failCount = 0;

        foreach ($data as $row) {
            if (count($row) < count($header)) {
                continue;
            }

            $rowData = array_combine($header, $row);

            $email = $rowData['email'] ?? null;
            $nim = $rowData['nim'] ?? null;

            // Cek duplikasi berdasarkan email atau NIM
            $existingUser = null;
            if ($email) {
                $existingUser = User::where('email', $email)->first();
            }
            if (!$existingUser && $nim) {
                $existingUser = User::where('nim', $nim)->first();
            }

            if (!$existingUser && $email) {
                $plainPass = $rowData['password'] ?? 'password123';
                
                User::create([
                    'name' => $rowData['name'] ?? 'Mahasiswa',
                    'email' => $email,
                    'nim' => $nim ?? '-',
                    'role' => 'mahasiswa',
                    'password' => Hash::make($plainPass),
                    'plain_password' => $plainPass,
                    'prodi' => $rowData['prodi'] ?? '-',
                    'jenis_mhs' => $rowData['jenis_mhs'] ?? 'Reguler',
                    'angkatan' => $rowData['angkatan'] ?? '-',
                    'jenis_kelamin' => $rowData['jenis_kelamin'] ?? 'Laki-Laki',
                    'dosen_wali' => $rowData['dosen_wali'] ?? '-',
                    'ttl' => $rowData['ttl'] ?? '-',
                    'alamat' => $rowData['alamat'] ?? '-',
                    'status' => $rowData['status'] ?? 'Aktif',
                ]);
                $successCount++;
            } else {
                $failCount++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Import Berhasil! Menambahkan {$successCount} data mahasiswa. ({$failCount} data dilewati karena sudah terdaftar).",
        ], 200);
    }
}