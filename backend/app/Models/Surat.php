<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Surat extends Model
{
    use HasFactory;
    
    // Tambahkan 'tanggal_pengajuan' dan 'alasan_penolakan' di sini
    protected $fillable = [
        'user_id', 
        'judul_surat', 
        'jenis_surat',
        'keperluan', 
        'lampiran',
        'status',
        'file_surat',
        'keterangan_admin',
        'tanggal_pengajuan',
        'alasan_penolakan'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}