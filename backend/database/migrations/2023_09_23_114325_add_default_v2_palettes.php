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
                    'hue_1'        => 0,
                    'saturation_1' => 88,
                    'hue_2'        => 60,
                    'saturation_2' => 88,
                    'hue_3'        => 146,
                    'saturation_3' => 88,
                    'balance'      => 50,
                ],
                [
                    'hue_1'        => 219,
                    'saturation_1' => 86,
                    'hue_2'        => 279,
                    'saturation_2' => 86,
                    'hue_3'        => 87,
                    'saturation_3' => 86,
                    'balance'      => 50,
                ],
                [
                    'hue_1'        => 129,
                    'saturation_1' => 75,
                    'hue_2'        => 189,
                    'saturation_2' => 75,
                    'hue_3'        => 261,
                    'saturation_3' => 75,
                    'balance'      => 50,
                ],
                [
                    'hue_1'        => 257,
                    'saturation_1' => 32,
                    'hue_2'        => 332,
                    'saturation_2' => 32,
                    'hue_3'        => 191,
                    'saturation_3' => 68,
                    'hue_3'        => 194,
                    'saturation_3' => 10,
                    'balance'      => 50,
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
