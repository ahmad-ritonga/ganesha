<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Increase price column size to handle larger amounts
        DB::statement("ALTER TABLE transaction_items MODIFY COLUMN price DECIMAL(12,2) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert price column size back to original
        DB::statement("ALTER TABLE transaction_items MODIFY COLUMN price DECIMAL(8,2) NOT NULL");
    }
};
