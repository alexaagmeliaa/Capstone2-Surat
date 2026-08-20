<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surats', function (Blueprint $table) {
            if (!Schema::hasColumn('surats', 'judul_surat')) {
                $table->string('judul_surat')->nullable();
            }
            if (!Schema::hasColumn('surats', 'jenis_surat')) {
                $table->string('jenis_surat')->nullable();
            }
            if (!Schema::hasColumn('surats', 'keperluan')) {
                $table->text('keperluan')->nullable();
            }
            if (!Schema::hasColumn('surats', 'lampiran')) {
                $table->string('lampiran')->nullable();
            }
            if (!Schema::hasColumn('surats', 'status')) {
                $table->string('status')->default('Pending');
            }
            if (!Schema::hasColumn('surats', 'tanggal_pengajuan')) {
                $table->timestamp('tanggal_pengajuan')->nullable();
            }
            if (!Schema::hasColumn('surats', 'alasan_penolakan')) {
                $table->text('alasan_penolakan')->nullable();
            }
        });
    }

    public function down(): void
    {
        // Kosongkan saja
    }
};