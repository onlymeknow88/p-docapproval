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
        Schema::create('worksheet_bas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('berita_acara_id');
            $table->string('worksheet_project_id')->nullable();
            $table->decimal('Realisation',10,2);
            $table->decimal('Invoice',12,2);
            $table->string('CreatedBy',45);
            $table->string('UpdatedBy',45)->nullable();
            $table->timestamps();

            $table->foreign('berita_acara_id')->references('id')->on('berita_acaras')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worksheet_bas');
    }
};
