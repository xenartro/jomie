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
        Schema::create('visual_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->index();
            $table->integer('palette_id')->index();
            $table->integer('font_id')->index();
            $table->integer('layout_id')->index();
            $table->boolean('published')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('visual_settings');
    }
};
