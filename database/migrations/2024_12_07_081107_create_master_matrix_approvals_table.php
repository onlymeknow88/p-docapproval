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
        Schema::create('master_matrix_approvals', function (Blueprint $table) {
            $table->id();
            $table->string('MaType',45);
            $table->string('WfName',45)->unique();
            $table->bigInteger('MinValue');
            $table->bigInteger('UptoValue');
            $table->string('Approval',50);
            $table->string('CreatedBy',45);
            $table->string('UpdatedBy',45);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_matrix_approvals');
    }
};
