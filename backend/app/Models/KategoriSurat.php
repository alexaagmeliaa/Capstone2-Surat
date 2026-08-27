<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriSurat extends Model
{
    use HasFactory;

    protected $table = 'kategori_surats';
    
    // Izinkan kolom-kolom ini diisi
    protected $fillable = [
        'kode_kategori',
        'nama_kategori',
        'jenis_kategori',
        'deskripsi',
        'status'
    ];
}