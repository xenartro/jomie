<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_preferences', function (Blueprint $table) {
            $table->string('meta_title', 255)->default('');
            $table->string('meta_description', 512)->default('');
            $table->boolean('basics_enabled')->default(true);
            $table->boolean('links_enabled')->default(true);
            $table->boolean('posts_enabled')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_preferences', function (Blueprint $table) {
            $table->dropColumn('meta_title');
            $table->dropColumn('meta_description');
            $table->dropColumn('basics_enabled');
            $table->dropColumn('links_enabled');
            $table->dropColumn('posts_enabled');
        });
    }
};
