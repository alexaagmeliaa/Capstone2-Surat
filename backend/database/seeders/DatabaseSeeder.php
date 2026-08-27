<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\KategoriSurat;
use App\Models\Surat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ==========================================
        // 1. DATA DUMMY USER (Mahasiswa & Admin)
        // ==========================================
        // Teknik Informatika (IF): Prefix 12 + 2 digit tahun angkatan (2024 -> 1224xxx)
        $mhs1 = User::updateOrCreate(
            ['email' => '1224016@stmik.ac.id'],
            [
                'name' => 'Alexa Agmelia',
                'nim' => '1224016',
                'password' => bcrypt('STMIK2024'),
                'plain_password' => 'STMIK2024',
                'role' => 'mahasiswa',
                'prodi' => 'Teknik Informatika',
                'jenis_mhs' => 'Reguler',
                'angkatan' => '2024',
                'jenis_kelamin' => 'Perempuan',
                'dosen_wali' => 'Dr. Budi Santoso, M.Kom',
                'ttl' => 'Bandung, 15 Mei 2004',
                'alamat' => 'Jl. Merdeka No. 45, Bandung',
                'status' => 'Aktif',
            ]
        );

        // Sistem Informasi (SI): Prefix 32 + 2 digit tahun angkatan (2023 -> 3223xxx)
        $mhs2 = User::updateOrCreate(
            ['email' => '3223017@stmik.ac.id'],
            [
                'name' => 'Rizky Pratama',
                'nim' => '3223017',
                'password' => bcrypt('password123'),
                'plain_password' => 'password123',
                'role' => 'mahasiswa',
                'prodi' => 'Sistem Informasi',
                'jenis_mhs' => 'Karyawan',
                'angkatan' => '2023',
                'jenis_kelamin' => 'Laki-Laki',
                'dosen_wali' => 'Siti Nurhaliza, M.T.',
                'ttl' => 'Jakarta, 10 Agustus 2003',
                'alamat' => 'Jl. Sudirman No. 12, Jakarta',
                'status' => 'Aktif',
            ]
        );

        // Teknik Informatika (IF): Prefix 12 + 2 digit tahun angkatan (2024 -> 1224xxx)
        $mhs3 = User::updateOrCreate(
            ['email' => '1224018@stmik.ac.id'],
            [
                'name' => 'Siti Rahmawati',
                'nim' => '1224018',
                'password' => bcrypt('password123'),
                'plain_password' => 'password123',
                'role' => 'mahasiswa',
                'prodi' => 'Teknik Informatika',
                'jenis_mhs' => 'Reguler',
                'angkatan' => '2024',
                'jenis_kelamin' => 'Perempuan',
                'dosen_wali' => 'Dr. Budi Santoso, M.Kom',
                'ttl' => 'Cirebon, 22 November 2004',
                'alamat' => 'Jl. Pemuda No. 88, Cirebon',
                'status' => 'Aktif',
            ]
        );

        // Sistem Informasi (SI): Prefix 32 + 2 digit tahun angkatan (2024 -> 3224xxx)
        $mhs4 = User::updateOrCreate(
            ['email' => '3224001@stmik.ac.id'],
            [
                'name' => 'Fajar Nugraha',
                'nim' => '3224001',
                'password' => bcrypt('password123'),
                'plain_password' => 'password123',
                'role' => 'mahasiswa',
                'prodi' => 'Sistem Informasi',
                'jenis_mhs' => 'Reguler',
                'angkatan' => '2024',
                'jenis_kelamin' => 'Laki-Laki',
                'dosen_wali' => 'Ahmad Fauzi, M.Cs.',
                'ttl' => 'Bogor, 05 April 2002',
                'alamat' => 'Jl. Pajajaran No. 23, Bogor',
                'status' => 'Aktif',
            ]
        );

        // Admin Accounts
        User::updateOrCreate(
            ['email' => 'admin@stmik.ac.id'],
            [
                'name' => 'Administrator Campus',
                'password' => bcrypt('admin123'),
                'plain_password' => 'admin123',
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'tu@stmik.ac.id'],
            [
                'name' => 'Staf TU Akademik',
                'password' => bcrypt('admin123'),
                'plain_password' => 'admin123',
                'role' => 'admin',
            ]
        );


        // ==========================================
        // 2. DATA DUMMY KATEGORI SURAT
        // ==========================================
        $kat1 = KategoriSurat::firstOrCreate(
            ['nama_kategori' => 'Surat Keterangan Aktif Kuliah'],
            [
                'kode_kategori' => 'SKAK',
                'jenis_kategori' => 'Keterangan',
                'deskripsi' => 'Surat permohonan keterangan mahasiswa aktif untuk keperluan beasiswa, tunjangan gaji orang tua, atau dinas.',
                'status' => true
            ]
        );

        $kat2 = KategoriSurat::firstOrCreate(
            ['nama_kategori' => 'Surat Pengantar Magang / PKL'],
            [
                'kode_kategori' => 'SPM',
                'jenis_kategori' => 'Pengantar',
                'deskripsi' => 'Surat permohonan pengantar dari kampus untuk instansi/perusahaan tempat pelaksanaan Magang atau Praktik Kerja Lapangan.',
                'status' => true
            ]
        );

        $kat3 = KategoriSurat::firstOrCreate(
            ['nama_kategori' => 'Surat Izin Penelitian Skripsi'],
            [
                'kode_kategori' => 'SIPS',
                'jenis_kategori' => 'Izin',
                'deskripsi' => 'Surat permohonan izin pengambilan data / penelitian di instansi untuk keperluan Tugas Akhir atau Skripsi.',
                'status' => true
            ]
        );

        $kat4 = KategoriSurat::firstOrCreate(
            ['nama_kategori' => 'Surat Keterangan Kelakuan Baik'],
            [
                'kode_kategori' => 'SKKB',
                'jenis_kategori' => 'Keterangan',
                'deskripsi' => 'Surat keterangan dari pihak kampus yang menyatakan mahasiswa tidak pernah melakukan pelanggaran disiplin.',
                'status' => true
            ]
        );

        $kat5 = KategoriSurat::firstOrCreate(
            ['nama_kategori' => 'Surat Cuti Akademik'],
            [
                'kode_kategori' => 'SCA',
                'jenis_kategori' => 'Permohonan',
                'deskripsi' => 'Surat permohonan izin penghentian studi sementara (cuti akademik) untuk semester berjalan.',
                'status' => true
            ]
        );


        // ==========================================
        // 3. DATA DUMMY SURAT / PENGAJUAN SURAT
        // ==========================================
        // 1. Pending (Alexa - IF 2024)
        Surat::firstOrCreate(
            ['user_id' => $mhs1->id, 'keperluan' => 'Permohonan pengajuan beasiswa Pendidikan Kemendikbud 2026'],
            [
                'jenis_surat' => $kat1->nama_kategori,
                'judul_surat' => $kat1->nama_kategori,
                'tujuan_surat' => 'Kemendikbud Ristek RI',
                'status' => 'Pending',
                'lampiran' => 'lampiran_beasiswa_1224016.pdf',
                'tanggal_pengajuan' => now()->subDays(2),
            ]
        );

        // 2. Diproses (Rizky - SI 2023)
        Surat::firstOrCreate(
            ['user_id' => $mhs2->id, 'keperluan' => 'Permohonan pengantar Kerja Praktik di PT Telekomunikasi Indonesia Tbk'],
            [
                'jenis_surat' => $kat2->nama_kategori,
                'judul_surat' => $kat2->nama_kategori,
                'tujuan_surat' => 'PT Telekomunikasi Indonesia Tbk',
                'status' => 'Diproses',
                'lampiran' => 'proposal_pkl_3223017.pdf',
                'keterangan_admin' => 'Surat sedang ditandatangani oleh Ketua Program Studi.',
                'tanggal_pengajuan' => now()->subDays(4),
            ]
        );

        // 3. Selesai (Siti Rahmawati - IF 2024)
        Surat::firstOrCreate(
            ['user_id' => $mhs3->id, 'keperluan' => 'Permohonan izin observasi dan wawancara penelitian Skripsi di Dinas Kominfo'],
            [
                'jenis_surat' => $kat3->nama_kategori,
                'judul_surat' => $kat3->nama_kategori,
                'tujuan_surat' => 'Kepala Dinas Kominfo Kota Bandung',
                'status' => 'Selesai',
                'lampiran' => 'lampiran_skripsi_1224018.pdf',
                'file_surat' => 'surat_penelitian_1224018_signed.pdf',
                'file_hasil' => 'surat_penelitian_1224018_signed.pdf',
                'keterangan_admin' => 'Surat sudah selesai diproses dan di-ttd digital.',
                'tanggal_pengajuan' => now()->subDays(7),
            ]
        );

        // 4. Ditolak (Fajar Nugraha - SI 2024)
        Surat::firstOrCreate(
            ['user_id' => $mhs4->id, 'keperluan' => 'Pengajuan surat kelakuan baik untuk beasiswa swasta'],
            [
                'jenis_surat' => $kat4->nama_kategori,
                'judul_surat' => $kat4->nama_kategori,
                'tujuan_surat' => 'Yayasan Beasiswa Prestasi Indonesia',
                'status' => 'Ditolak',
                'lampiran' => 'ktp_3224001.jpg',
                'alasan_penolakan' => 'Lampiran KTM/KTP tidak jelas. Mohon upload ulang dokumen scan yang jelas.',
                'keterangan_admin' => 'Ditolak karena dokumen lampiran tidak terbaca.',
                'tanggal_pengajuan' => now()->subDays(5),
            ]
        );

        // 5. Pending (Pengajuan ke-2 Alexa - IF 2024)
        Surat::firstOrCreate(
            ['user_id' => $mhs1->id, 'keperluan' => 'Permohonan pengantar Magang Kampus Merdeka Batch 6'],
            [
                'jenis_surat' => $kat2->nama_kategori,
                'judul_surat' => $kat2->nama_kategori,
                'tujuan_surat' => 'Tim Kampus Merdeka Kemendikbud',
                'status' => 'Pending',
                'lampiran' => 'cv_transkrip_1224016.pdf',
                'tanggal_pengajuan' => now()->subHours(5),
            ]
        );
    }
}