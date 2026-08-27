<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengajuanSurat extends Model
{
    use HasFactory;

    // Menentukan nama tabel secara eksplisit karena namanya 'surats'
    protected $table = 'surats';

    protected $fillable = [
        'user_id',
        'jenis_surat',
        'judul_surat',
        'keperluan',
        'tujuan_surat',
        'lampiran',
        'status',
        'file_surat',
        'file_hasil',
        'keterangan_admin',
        'tanggal_pengajuan',
        'alasan_penolakan',
    ];

    // Relasi: Satu pengajuan surat ini milik satu user (mahasiswa)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}