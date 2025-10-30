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
        Schema::create('seasonings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand')->nullable();    
            $table->string('genre')->unique();
            $table->unsignedInteger('price')->nullable(); 
            $table->string('volume')->nullable();
            $table->string('image_path')->nullable();
            $table->string('shop_url')->nullable();
            $table->boolean('is_published')->default(true)->index();

            $table->boolean('gf')->default(true);
            $table->boolean('df')->default(true);
            $table->boolean('sf')->default(true);
            $table->boolean('af')->default(true);

            $table->text('ingredients_text')->nullable();
            $table->text('description')->nullable();
            $table->text('features')->nullable();
            $table->text('alternatives')->nullable();
            $table->timestamps();

        }); 

        Schema::create('recipe_seasoning',function(Blueprint $table){
            $table->id();
            $table->foreignId('recipe_id')->constrained()->onDelete('cascade');
            $table->foreignId('seasoning_id')->constrained()->onDelete('cascade');
            $table->unique(['recipe_id','seasoning_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_seasoning');
        Schema::dropIfExists('seasonings'); 
    }
};
