<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('seasonings', function (Blueprint $table) {
            $table->dropUnique('seasonings_genre_unique'); // ★ インデックス名
        });
    }

    public function down(): void
    {
        Schema::table('seasonings', function (Blueprint $table) {
            $table->unique('genre');
        });
    }
};
