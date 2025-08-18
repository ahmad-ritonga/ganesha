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
        Schema::create('transaction_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('transaction_id');
            $table->enum('item_type', ['book', 'chapter']);
            $table->ulid('item_id');
            $table->string('item_title');
            $table->decimal('price', 8, 2);
            $table->integer('quantity')->default(1);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');

            $table->index(['transaction_id', 'item_type']);
            $table->index(['item_type', 'item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
    }
};
