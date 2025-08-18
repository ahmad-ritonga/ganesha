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
        Schema::create('reviews', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('book_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('rating')->unsigned();
            $table->text('review_text')->nullable();
            $table->boolean('is_approved')->default(true);
            $table->timestamps();

            // Unique constraint untuk mencegah multiple review per user per book
            $table->unique(['user_id', 'book_id'], 'unique_user_book_review');

            // Index untuk query performance
            $table->index(['book_id', 'is_approved', 'rating']);
            $table->index(['user_id', 'is_approved']);
            $table->index(['rating', 'is_approved']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
