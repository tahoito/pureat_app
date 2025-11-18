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
        Schema::table('seasonings', function (Blueprint $table) {
            $table->text('description')->nullable()->after('quantity_unit');
            $table->text('ingredients_text')->nullable()->after('description');
            $table->string('shop_url')->nullable()->after('ingredients_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seasonings', function (Blueprint $table) {
            $table->dropColumn(['description','ingredients_text','shop_url']);
        });
    }
};
