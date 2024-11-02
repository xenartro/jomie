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
            $table->string('identity')->default('human');
            $table->string('site_type')->default('dont-know');
            $table->string('update_frequency')->default('dont-know');
            $table->boolean('setup_completed')->default(false);
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
            $table->dropColumn('identity');
            $table->dropColumn('site_type');
            $table->dropColumn('update_frequency');
            $table->dropColumn('setup_completed');
        });
    }
};
