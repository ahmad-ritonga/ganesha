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
        Schema::create('user_purchases', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('user_id');
            $table->string('purchasable_type', 50); // 'book' or 'chapter'
            $table->ulid('purchasable_id');
            $table->ulid('transaction_id');
            $table->timestamp('purchased_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');

            $table->unique(['user_id', 'purchasable_type', 'purchasable_id'], 'unique_user_purchase');
            $table->index(['user_id', 'purchasable_type']);
            $table->index(['purchasable_type', 'purchasable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_purchases');
    }
};
