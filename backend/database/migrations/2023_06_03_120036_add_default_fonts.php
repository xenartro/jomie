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
        DB::table('fonts')
            ->insert([
                [
                    'name' => 'Modern',
                    'primary_font' => 'Roboto',
                    'secondary_font' => 'Roboto',
                    'primary_font_size' => '16px',
                    'secondary_font_size' => '14px',
                ],
                [
                    'name' => 'Traditional',
                    'primary_font' => 'Times New Roman',
                    'secondary_font' => 'Times New Roman',
                    'primary_font_size' => '16px',
                    'secondary_font_size' => '14px',

                ],
                [
                    'name' => 'Mono',
                    'primary_font' => 'Courier New',
                    'secondary_font' => 'Courier New',
                    'primary_font_size' => '16px',
                    'secondary_font_size' => '14px',
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
        DB::table('fonts')
            ->where('id', '>' , 0)
            ->delete();
    }
};
