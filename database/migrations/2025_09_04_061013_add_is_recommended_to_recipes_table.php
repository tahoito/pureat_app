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
        if (!Schema::hasColumn('recipes', 'is_recommended')) {
            Schema::table('recipes', function (Blueprint $table) {
                $table->boolean('is_recommended')->default(false)->index();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('recipes', 'is_recommended')) {
            Schema::table('recipes', function (Blueprint $table) {
                $table->dropColumn('is_recommended');
            });
        }
    }
};
