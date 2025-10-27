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
            if (!Schema::hasColumn('recipes', 'share_token')) {
                $t->string('share_token', 64)->nullable()->unique();
            }
            if (!Schema::hasColumn('recipes', 'share_expires_at')) {
                $t->timestamp('share_expires_at')->nullable();
            }
            if (!Schema::hasColumn('recipes', 'share_enabled')) {
                $t->boolean('share_enabled')->default(false)->index();
            }
        });
    }


    /**
     * Reverse the migrations.
     */
    
    public function down(): void
    {
        if (\Schema::hasColumn('categories', 'sort_order')) {
            // SQLiteはインデックス付きカラム削除で落ちるので、index削除→column削除の順
            \Schema::table('categories', function (\Illuminate\Database\Schema\Blueprint $table) {
                $sm = \Schema::getConnection()->getDoctrineSchemaManager();
                $indexes = $sm->listTableIndexes('categories');

                // indexが存在すれば削除
                if (array_key_exists('categories_sort_order_index', $indexes)) {
                    $table->dropIndex('categories_sort_order_index');
                }

                $table->dropColumn('sort_order');
            });
        }
    }


};
