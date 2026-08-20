<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surats', function (Blueprint $table) {
            // Menyesuaikan nama kolom jika belum ada
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
        });
    }

    public function down(): void
    {
        // Kosongkan saja
    }
};