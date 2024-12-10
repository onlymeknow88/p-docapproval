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
        Schema::create('worksheet_projects', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->unsignedBigInteger('project_id');
            $table->string('JobDescription',150);
            $table->string('Unit',20);
            $table->bigInteger('UnitPriceRP');
            $table->bigInteger('Target');
            $table->bigInteger('Realisation')->nullable();
            $table->bigInteger('Invoice')->nullable();
            $table->string('CreatedBy',45);
            $table->string('UpdatedBy',45);
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worksheet_projects');
    }
};
