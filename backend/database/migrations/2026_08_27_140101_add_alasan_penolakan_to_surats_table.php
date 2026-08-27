<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('surats', function (Blueprint $table) {
            // Menambahkan kolom alasan penolakan jika ditolak
            if (!Schema::hasColumn('surats', 'alasan_penolakan')) {
                $table->text('alasan_penolakan')->nullable();
            }
            
            // Menambahkan kolom file hasil jika belum ada
            if (!Schema::hasColumn('surats', 'file_hasil')) {
                $table->string('file_hasil')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surats', function (Blueprint $table) {
            $table->dropColumn(['alasan_penolakan', 'file_hasil']);
        });
    }
};