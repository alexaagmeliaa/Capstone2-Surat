<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('surats'); // Hapus tabel lama jika ada agar bersih

        Schema::create('surats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('judul_surat')->nullable();
            $table->string('jenis_surat')->nullable(); // Sesuai dengan dropdown di React
            $table->text('keperluan')->nullable();
            $table->string('lampiran')->nullable(); // Untuk menyimpan file PDF/JPG mahasiswa
            $table->string('status')->default('Pending'); // Pending, Diproses, Selesai, Ditolak
            $table->string('file_surat')->nullable();
            $table->text('keterangan_admin')->nullable();
            $table->timestamp('tanggal_pengajuan')->nullable();
            $table->text('alasan_penolakan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surats');
    }
};