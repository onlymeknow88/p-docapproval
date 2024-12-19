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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('PONum',50);
            $table->string('ProjectName',100);
            $table->string('Abbreviation',10);
            $table->bigInteger('ProjectValue');
            $table->string('VendorId',20);
            $table->string('ProjectType',20);
            $table->string('PICName',50)->nullable();
            $table->string('PICPosition',50)->nullable();
            $table->string('PICIdCardNo',50)->nullable();
            $table->string('PICAddress',50)->nullable();
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
        Schema::dropIfExists('projects');
    }
};
