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
        Schema::create('author_submissions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('user_id');
            $table->string('submission_type'); // 'regular', 'premium', 'enterprise'
            $table->string('title');
            $table->text('description');
            $table->string('category_slug')->nullable();
            $table->string('pdf_file_path');
            $table->string('status')->default('pending'); // pending, under_review, approved, rejected, published
            $table->ulid('transaction_id')->nullable(); // reference to payment transaction
            $table->ulid('created_book_id')->nullable(); // reference to created book if approved
            $table->text('admin_notes')->nullable();
            $table->timestamp('submitted_at');
            $table->timestamp('reviewed_at')->nullable();
            $table->ulid('reviewed_by')->nullable(); // admin user id
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('set null');
            $table->foreign('created_book_id')->references('id')->on('books')->onDelete('set null');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');

            $table->index(['user_id', 'status']);
            $table->index('submission_type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('author_submissions');
    }
};
