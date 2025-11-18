<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('seasonings', function (Blueprint $table) {
            //$table->text('description')->nullable();
            //$table->text('ingredients_text')->nullable();
            //$table->string('shop_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('seasonings', function (Blueprint $table) {
            $table->dropColumn(['description','ingredients_text','shop_url']);
        });
    }
};
