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
        Schema::create('ba_app_wfs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ba_app_id');
            $table->string('Approver',100);
            $table->dateTime('DateSend')->nullable();
            $table->string('Action',20)->nullable();
            $table->dateTime('ActionDate')->nullable();
            $table->string('Comment',200)->nullable();
            $table->string('ApprovalType',50);
            $table->longText('MsgBody')->nullable();
            $table->bigInteger('DayLimit')->nullable();
            $table->longText('DayLimitP1Notif')->nullable();
            $table->longText('DayLimitP2Notif')->nullable();
            $table->longText('DayLimitP3Notif')->nullable();
            $table->string('CreatedBy',45);
            $table->string('UpdatedBy',45);
            $table->timestamps();

            $table->foreign('ba_app_id')->references('id')->on('ba_apps')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ba_app_wfs');
    }
};
