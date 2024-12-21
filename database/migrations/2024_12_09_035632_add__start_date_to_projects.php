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
        Schema::table('projects', function (Blueprint $table) {
            $table->string('PRNum',50)->after('PONum');
            $table->bigInteger('DpValue')->after('ProjectType')->nullable();
            $table->date('DpValidityPeriodStart')->nullable();
            $table->date('DpValidityPeriodEnd')->nullable();
            $table->date('ExecutionTimeStart')->nullable();
            $table->date('ExecutionTimeEnd')->nullable();
            $table->date('ValidityPeriodGuaranteeStart')->nullable();
            $table->date('ValidityPeriodGuaranteeEnd')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'PRNum',
                'DpValue',
                'DpValidityPeriodStart',
                'DpValidityPeriodEnd',
                'ExecutionTimeStart',
                'ExecutionTimeEnd',
                'ValidityPeriodGuaranteeStart',
                'ValidityPeriodGuaranteeEnd',
            ]);
        });
    }
};
