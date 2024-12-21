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
        Schema::create('master_lookup_values', function (Blueprint $table) {
            $table->id();
            $table->string('Group');
            $table->string('Text');
            $table->string('Value');
            $table->bigInteger('IsActive');
            $table->string('CreatedBy',45);
            $table->string('UpdatedBy',45)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_lookup_values');
    }
};
