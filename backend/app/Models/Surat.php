<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Surat extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'judul_surat', 'keperluan', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}