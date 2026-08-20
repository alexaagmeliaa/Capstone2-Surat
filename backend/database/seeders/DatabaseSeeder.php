<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Buat Akun Mahasiswa
        User::factory()->create([
            'name' => 'Alexa',
            'email' => '1224016@stmik.com',
            'password' => bcrypt('STMIK2024'),
            'role' => 'mahasiswa',
        ]);

        // 2. Buat Akun Admin
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }
}