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
        Schema::create('chapter_media', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('chapter_id');
            $table->enum('type', ['image', 'video', 'audio', 'document']);
            $table->string('file_path', 500);
            $table->string('file_name');
            $table->integer('file_size')->nullable();
            $table->string('alt_text')->nullable();
            $table->text('caption')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('chapter_id')->references('id')->on('chapters')->onDelete('cascade');

            $table->index(['chapter_id', 'type']);
            $table->index(['chapter_id', 'order_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chapter_media');
    }
};
