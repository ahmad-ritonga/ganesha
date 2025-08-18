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
        Schema::create('chapters', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('book_id');
            $table->string('title');
            $table->string('slug');
            $table->integer('chapter_number');
            $table->longText('content')->nullable();
            $table->text('excerpt')->nullable();
            $table->boolean('is_free')->default(false);
            $table->decimal('price', 8, 2)->default(0.00);
            $table->integer('reading_time_minutes')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');

            $table->unique(['book_id', 'chapter_number'], 'unique_book_chapter');
            $table->unique(['book_id', 'slug'], 'unique_book_slug');

            $table->index(['book_id', 'is_published']);
            $table->index(['book_id', 'chapter_number']);
            $table->index(['is_free', 'is_published']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chapters');
    }
};
