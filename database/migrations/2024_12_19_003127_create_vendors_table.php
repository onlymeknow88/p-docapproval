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
        Schema::create('vendors', function (Blueprint $table) {
            $table->bigInteger('Id')->primary();
            $table->string('VendorNo')->nullable();
            $table->string('VendorName')->nullable();
            $table->string('Abbreviation')->nullable();
            $table->string('UserName')->nullable();
            $table->string('Password')->nullable();
            $table->string('Email')->nullable();
            $table->string('VendorType')->nullable();
            $table->string('NoTelp')->nullable();
            $table->string('City')->nullable();
            $table->string('Country')->nullable();
            $table->string('PostalCode')->nullable();
            $table->bigInteger('Active')->nullable();
            $table->string('CreatedBy')->nullable();
            $table->timestamp('Created')->nullable();
            $table->string('ModifiedBy')->nullable();
            $table->timestamp('Modified')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
