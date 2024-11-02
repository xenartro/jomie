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

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('palettes')
            ->where('id', '>' , 0)
            ->delete();
    }
};
