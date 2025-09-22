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
        Schema::table('recipes', function (Blueprint $t) {
            $t->string('share_token',64)->nullable()->unique();
            $t->timestamp('share_expires_at')->nullable();
            $t->boolean('share_enabled')->default(false)->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recipes', function (Blueprint $t) {
            $t->dropColum(['share_token','share_expires_at','share_enabled']);
        });
    }
};
