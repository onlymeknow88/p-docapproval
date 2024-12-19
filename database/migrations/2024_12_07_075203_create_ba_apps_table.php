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
        Schema::create('ba_apps', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->string('DocNum',50)->nullable();
            $table->string('ApprovalName',50);
            $table->string('AttchmentPath',250)->nullable();
            $table->string('AttchmentName',250)->nullable();
            $table->string('Approvers',250);
            $table->longText('UrlCallBack')->nullable();
            $table->string('ApprovalStatus',10);
            $table->string('CreatedBy',45);
            $table->string('UpdatedBy',45)->nullable();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ba_apps');
    }
};
