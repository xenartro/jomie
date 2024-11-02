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
        Schema::dropIfExists('palettes');
        Schema::create('palettes', function (Blueprint $table) {
            $table->id();

            $table->integer('hue_1');
            $table->integer('saturation_1');
            $table->integer('hue_2')->nullable()->default(null);
            $table->integer('saturation_2')->nullable()->default(null);
            $table->integer('hue_3')->nullable()->default(null);
            $table->integer('saturation_3')->nullable()->default(null);
            $table->integer('hue_4')->nullable()->default(null);
            $table->integer('saturation_4')->nullable()->default(null);

            $table->integer('balance')->default(50);

            $table->integer('user_id')->index()->nullable();
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
        Schema::dropIfExists('palettes');
        Schema::create('palettes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('color_neutral', 7);
            $table->string('color_primary', 7);
            $table->string('color_accent', 7);
            $table->integer('user_id')->index()->nullable();
            $table->timestamps();
        });
        DB::table('palettes')
            ->insert([
                [
                    'name' => 'Palette 1',
                    'color_neutral' => '#EEEEEF',
                    'color_primary' => '#66EEFF',
                    'color_accent' => '#FFCC00',
                ],
                [
                    'name' => 'Palette 2',
                    'color_neutral' => '#FFCCEF',
                    'color_primary' => '#0000FE',
                    'color_accent' => '#666600',
                ],
                [
                    'name' => 'Palette 3',
                    'color_neutral' => '#FFEEEF',
                    'color_primary' => '#0000FE',
                    'color_accent' => '#00FF00',
                ],
            ]);
    }
};
