<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = ['prodi', 'jenis_mhs', 'angkatan', 'jenis_kelamin', 'dosen_wali', 'ttl', 'alamat', 'status'];
            foreach ($columns as $col) {
                if (!Schema::hasColumn('users', $col)) {
                    $table->string($col)->nullable();
                }
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['prodi', 'jenis_mhs', 'angkatan', 'jenis_kelamin', 'dosen_wali', 'ttl', 'alamat', 'status']);
        });
    }
};