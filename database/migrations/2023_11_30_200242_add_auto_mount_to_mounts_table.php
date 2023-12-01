<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mounts', function (Blueprint $table) {
            $table->boolean('mount_on_install')->default(false)->after('user_mountable');
            $table->boolean('auto_mount')->default(false)->after('mount_on_install');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mounts', function (Blueprint $table) {
            $table->dropColumn('mount_on_install');
            $table->dropColumn('auto_mount');
        });
    }
};
