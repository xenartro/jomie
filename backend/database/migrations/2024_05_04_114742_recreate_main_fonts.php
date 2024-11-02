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
            ->where('id', '<=', 4)
            ->delete();
        
        DB::table('fonts')
            ->insert([
                [
                    'id'          => 1,
                    'name'        => 'Modern',
                    'main_family' => 'Switzer, sans-serif',
                    'family'      => 'Switzer, sans-serif',
                    'ratio'       => 2.3,
                    'weight'      => 2,
                ],
                [
                    'id'          => 2,
                    'name'        => 'Traditional',
                    'main_family' => 'Sentient, serif',
                    'family'      => 'Sentient, serif',
                    'ratio'       => 2.3,
                    'weight'      => 2,
                ],
                [
                    'id'          => 3,
                    'name'        => 'Monospace',
                    'main_family' => 'Sono, monospace',
                    'family'      => 'Sono, monospace',
                    'ratio'       => 2.3,
                    'weight'      => 2,
                ],
                [
                    'id'          => 4,
                    'name'        => 'Cursive',
                    'main_family' => 'Telma, cursive',
                    'family'      => 'Telma, cursive',
                    'ratio'       => 2.3,
                    'weight'      => 2,
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
            ->where('id', '<=', 4)
            ->delete();
        
        DB::table('fonts')
            ->insert([
                [
                    'id'          => 1,
                    'name'        => 'Modern',
                    'main_family' => 'sans-serif',
                    'family'      => 'sans-serif',
                    'ratio'       => 1,
                    'weight'      => 1,
                ],
                [
                    'id'          => 2,
                    'name'        => 'Traditional',
                    'main_family' => 'serif',
                    'family'      => 'serif',
                    'ratio'       => 1,
                    'weight'      => 1,
                ],
                [
                    'id'          => 3,
                    'name'        => 'Mono',
                    'main_family' => 'Sono, monospace',
                    'family'      => 'Sono, monospace',
                    'ratio'       => 1,
                    'weight'      => 1,
                ],
            ]);
    }
};
