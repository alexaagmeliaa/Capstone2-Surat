<?php

namespace App\Models;

// 1. Tambahkan use HasApiTokens
use Laravel\Sanctum\HasApiTokens;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'name', 
    'email', 
    'password', 
    'plain_password', // <--- Tambahkan ini agar admin bisa melihat password jika mahasiswa lupa
    'role', 
    'nim', 
    'prodi', 
    'jenis_mhs', 
    'angkatan', 
    'jenis_kelamin', 
    'dosen_wali', 
    'ttl', 
    'alamat', 
    'status'
])] 
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    // 3. Tambahkan HasApiTokens di paling depan
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}