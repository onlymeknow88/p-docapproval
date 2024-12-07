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
        Schema::create('orchart_approvals', function (Blueprint $table) {
            $table->id();
            $table->string('CompanyId',3)->nullable();
            $table->string('DeptId',3)->nullable();
            $table->string('Name',100);
            $table->string('Email',100);
            $table->string('Position',150);
            $table->string('Checker',200)->nullable();
            $table->integer('ReportTo')->nullable();
            $table->string('CreatedBy');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orchart_approvals');
    }
};
