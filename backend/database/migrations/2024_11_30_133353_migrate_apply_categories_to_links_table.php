<?php

use App\Models\Link;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('links')
            ->where('type', Link::TYPE_LINK)
            ->update(['category' => Link::CATEGORY_LINK]);

        DB::table('links')
            ->where('type', '>', Link::TYPE_LINK)
            ->update(['category' => Link::CATEGORY_SOCIAL]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('links')
            ->update(['category' => 0]);
    }
};
