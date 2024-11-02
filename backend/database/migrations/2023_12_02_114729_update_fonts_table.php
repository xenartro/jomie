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
        Schema::table('fonts', function (Blueprint $table) {
            $table->dropColumn('primary_font');
            $table->dropColumn('secondary_font');
            $table->dropColumn('primary_font_size');
            $table->dropColumn('secondary_font_size');
            $table->string('main_family', 100)->default('');
            $table->double('ratio')->default(1);
            $table->integer('weight')->default(1);
            $table->string('family', 255)->default('');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fonts', function (Blueprint $table) {
            $table->string('primary_font', 100)->default('');
            $table->string('secondary_font', 100)->default('');
            $table->string('primary_font_size', 10)->default('');
            $table->string('secondary_font_size', 10)->default('');
            $table->dropColumn('main_family');
            $table->dropColumn('ratio');
            $table->dropColumn('weight');
            $table->dropColumn('family');
        });
    }
};
