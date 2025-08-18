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
        Schema::create('books', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('cover_image')->nullable();
            $table->ulid('author_id');
            $table->ulid('category_id');
            $table->string('isbn', 20)->unique()->nullable();
            $table->date('publication_date')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->integer('discount_percentage')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->integer('total_chapters')->default(0);
            $table->integer('reading_time_minutes')->default(0);
            $table->string('language', 10)->default('id');
            $table->json('tags')->nullable();
            $table->timestamps();

            $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');

            $table->index(['is_published', 'is_featured']);
            $table->index(['category_id', 'is_published']);
            $table->index(['author_id', 'is_published']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
