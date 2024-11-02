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
            $table->string('basics_name', 20)->default('Home');
            $table->string('links_name', 20)->default('Links');
            $table->string('posts_name', 20)->default('Posts');
            $table->string('photos_name', 20)->default('Photos');
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
            $table->dropColumn('basics_name');
            $table->dropColumn('links_name');
            $table->dropColumn('posts_name');
            $table->dropColumn('photos_name');
        });
    }
};
