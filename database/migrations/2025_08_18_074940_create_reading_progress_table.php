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
        Schema::create('reading_progress', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('chapter_id')->constrained()->cascadeOnDelete();
            $table->integer('progress_percentage')->default(0);
            $table->text('last_position')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Unique constraint untuk mencegah duplikasi progress per user per chapter
            $table->unique(['user_id', 'chapter_id'], 'unique_user_chapter');

            // Index untuk query performance
            $table->index(['user_id', 'progress_percentage']);
            $table->index(['chapter_id', 'progress_percentage']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reading_progress');
    }
};
