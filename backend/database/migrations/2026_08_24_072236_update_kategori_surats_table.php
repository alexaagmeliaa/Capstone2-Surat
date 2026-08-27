<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('kategori_surats', function (Blueprint $table) {
            $table->string('kode_kategori')->unique()->after('id')->nullable(); // Contoh: SK, SP, SR
            $table->string('jenis_kategori')->after('nama_kategori')->nullable(); // Untuk pengelompokan (Keterangan, Permohonan, dll)
            $table->boolean('status')->default(true)->after('deskripsi'); // Aktif / Non-Aktif
        });
    }

    public function down()
    {
        Schema::table('kategori_surats', function (Blueprint $table) {
            $table->dropColumn(['kode_kategori', 'jenis_kategori', 'status']);
        });
    }
};