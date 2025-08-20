<?php

use App\Http\Controllers\Admin\ReadingProgressAnalyticsController;
use App\Http\Controllers\Admin\UserEngagementAnalyticsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MyBooksController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\BookController as AdminBookController;
use App\Http\Controllers\Admin\ChapterController;
use App\Http\Controllers\Admin\ChapterMediaController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;
use App\Http\Controllers\Admin\TransactionAnalyticsController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransactionSyncController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\ReadingProgressController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about/index');
})->name('about');

Route::get('/copyright', function () {
    return Inertia::render('copyright');
})->name('copyright');

Route::get('/terms', function () {
    return Inertia::render('terms');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('privacy');
})->name('privacy');


// =====================================================
// Public Books & Categories Routes
// =====================================================
Route::prefix('books')->name('books.')->group(function () {
    Route::get('/', [BookController::class, 'index'])->name('index');
    Route::get('{book}', [BookController::class, 'show'])->name('show');
    Route::get('{book}/chapters/{chapter}', [BookController::class, 'readChapter'])->name('read-chapter');
});

Route::prefix('categories')->name('categories.')->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('index');
    Route::get('{category}', [CategoryController::class, 'show'])->name('show');
});

// API Routes for Categories
Route::prefix('api')->group(function () {
    // Categories API
    Route::get('categories', [AdminCategoryController::class, 'getGroupedBySlug'])->name('api.categories.grouped');
    Route::get('categories/{slug}', [AdminCategoryController::class, 'getBySlug'])->name('api.categories.by-slug');
    Route::get('categories/stats', [AdminCategoryController::class, 'getStats'])->name('api.categories.stats');

    // Navbar categories API
    Route::get('navbar/categories', [CategoryController::class, 'getForNavbar'])->name('api.navbar.categories');
});


// =====================================================
// Webhook routes (public, no middleware)
// =====================================================
Route::post('webhook/midtrans', [WebhookController::class, 'midtrans'])->name('webhook.midtrans');

// =====================================================
// User routes (auth + verified + role:user)
// =====================================================
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::delete('profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');
    Route::put('profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('my-books', [MyBooksController::class, 'index'])->name('my-books');

    Route::get('reading-history', function () {
        return Inertia::render('user/reading-history');
    })->name('reading-history');

    // Payment routes
    Route::prefix('payment')->name('payment.')->group(function () {
        Route::get('book/{book}', [PaymentController::class, 'showBookPayment'])->name('book.show');
        Route::post('book/{book}', [PaymentController::class, 'purchaseBook'])->name('book');
        Route::get('chapter/{chapter}', [PaymentController::class, 'showChapterPayment'])->name('chapter.show');
        Route::post('chapter/{chapter}', [PaymentController::class, 'purchaseChapter'])->name('chapter');
        Route::get('continue/{transaction}', [PaymentController::class, 'continuePayment'])->name('continue');
        Route::get('success/{transaction}', [PaymentController::class, 'success'])->name('success');
        Route::get('failed/{transaction}', [PaymentController::class, 'failed'])->name('failed');
        Route::get('pending/{transaction}', [PaymentController::class, 'pending'])->name('pending');
        Route::get('status/{transaction}', [PaymentController::class, 'checkStatus'])->name('status');
        Route::post('cancel/{transaction}', [PaymentController::class, 'cancel'])->name('cancel');
    });

    // API Routes for AJAX calls
    Route::prefix('api')->group(function () {
        Route::prefix('payment')->group(function () {
            Route::get('status/{transaction}', [PaymentController::class, 'checkStatus']);
        });
    });

    // Transaction routes
    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('index');
        Route::get('{transaction}', [TransactionController::class, 'show'])->name('show');
        Route::post('{transaction}/retry', [TransactionController::class, 'retry'])->name('retry');
        Route::post('sync-pending', [TransactionController::class, 'syncPending'])->name('sync-pending');
        Route::post('sync-all', [TransactionController::class, 'syncAll'])->name('sync-all');
    });

    // Reading Progress routes
    Route::prefix('reading-progress')->name('reading-progress.')->group(function () {
        Route::get('/', [ReadingProgressController::class, 'index'])->name('index');
        Route::get('analytics', [ReadingProgressController::class, 'analytics'])->name('analytics');
        Route::get('chapter/{chapter}', [ReadingProgressController::class, 'show'])->name('show');
        Route::put('chapter/{chapter}', [ReadingProgressController::class, 'update'])->name('chapter.update');
        Route::post('chapter/{chapter}/complete', [ReadingProgressController::class, 'markCompleted'])->name('complete');
        Route::get('book/{book}/stats', [ReadingProgressController::class, 'bookStats'])->name('book.stats');
        Route::post('/{book}', [ReadingProgressController::class, 'store'])->name('store');
        Route::put('/{book}', [ReadingProgressController::class, 'update'])->name('book.update');
    });

    // Review routes
    Route::prefix('reviews')->name('reviews.')->group(function () {
        Route::get('/', [ReviewController::class, 'userReviews'])->name('index');
        Route::get('stats', [ReviewController::class, 'userStats'])->name('stats');
        Route::get('book/{book}', [ReviewController::class, 'index'])->name('book');
        Route::post('book/{book}', [ReviewController::class, 'store'])->name('store');
        Route::put('{review}', [ReviewController::class, 'update'])->name('update');
        Route::delete('{review}', [ReviewController::class, 'destroy'])->name('destroy');
        // Backward compatibility
        Route::post('/{book}', [ReviewController::class, 'store'])->name('store.legacy');
        Route::put('/{review}', [ReviewController::class, 'update'])->name('update.legacy');
        Route::delete('/{review}', [ReviewController::class, 'destroy'])->name('destroy.legacy');
    });

    // Author routes
    Route::prefix('author')->name('author.')->group(function () {
        Route::get('pricing', [App\Http\Controllers\AuthorController::class, 'pricing'])->name('pricing');
        Route::get('dashboard', [App\Http\Controllers\AuthorController::class, 'dashboard'])->name('dashboard');
        Route::get('submit', [App\Http\Controllers\AuthorController::class, 'create'])->name('create');
        Route::post('submit', [App\Http\Controllers\AuthorController::class, 'store'])->name('store');
        Route::get('submissions', [App\Http\Controllers\AuthorController::class, 'submissions'])->name('submissions');
        Route::get('submissions/{submission}', [App\Http\Controllers\AuthorController::class, 'show'])->name('show');
        Route::get('submissions/{submission}/download', [App\Http\Controllers\AuthorController::class, 'downloadPdf'])->name('download');
        Route::get('submissions/{submission}/download-alt', [App\Http\Controllers\AuthorController::class, 'downloadPdfAlt'])->name('download-alt');
        Route::get('submissions/{submission}/debug-download', [App\Http\Controllers\AuthorController::class, 'debugDownload'])->name('debug-download');
        Route::post('subscribe/{plan}', [App\Http\Controllers\AuthorController::class, 'subscribe'])->name('subscribe');
    });
});


// =====================================================
// Admin routes (auth + verified + role:admin)
// =====================================================
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Users management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [AdminUserController::class, 'index'])->name('index');
        Route::get('{user}', [AdminUserController::class, 'show'])->name('show');
        Route::patch('{user}/toggle-role', [AdminUserController::class, 'toggleRole'])->name('toggle-role');
        Route::delete('{user}', [AdminUserController::class, 'destroy'])->name('destroy');
    });

    // Categories resource
    Route::resource('categories', AdminCategoryController::class);
    Route::patch('categories/{category}/toggle', [AdminCategoryController::class, 'toggle'])->name('categories.toggle');
    Route::delete('categories/bulk-delete', [AdminCategoryController::class, 'bulkDelete'])->name('categories.bulk-delete');

    // Books resource
    Route::resource('books', AdminBookController::class);
    Route::patch('books/{book}/toggle-published', [AdminBookController::class, 'togglePublished'])->name('books.toggle-published');
    Route::patch('books/{book}/toggle-featured', [AdminBookController::class, 'toggleFeatured'])->name('books.toggle-featured');
    Route::delete('books/bulk-delete', [AdminBookController::class, 'bulkDelete'])->name('books.bulk-delete');
    Route::patch('books/bulk-publish', [AdminBookController::class, 'bulkPublish'])->name('books.bulk-publish');
    Route::patch('books/bulk-unpublish', [AdminBookController::class, 'bulkUnpublish'])->name('books.bulk-unpublish');

    // Chapters nested resource
    Route::get('books/{book}/chapters', [ChapterController::class, 'index'])->name('books.chapters.index');
    Route::get('books/{book}/chapters/create', [ChapterController::class, 'create'])->name('books.chapters.create');
    Route::post('books/{book}/chapters', [ChapterController::class, 'store'])->name('books.chapters.store');
    Route::get('books/{book}/chapters/{chapter}', [ChapterController::class, 'show'])->name('books.chapters.show');
    Route::get('books/{book}/chapters/{chapter}/edit', [ChapterController::class, 'edit'])->name('books.chapters.edit');
    Route::put('books/{book}/chapters/{chapter}', [ChapterController::class, 'update'])->name('books.chapters.update');
    Route::patch('books/{book}/chapters/{chapter}', [ChapterController::class, 'update'])->name('books.chapters.patch');
    Route::delete('books/{book}/chapters/{chapter}', [ChapterController::class, 'destroy'])->name('books.chapters.destroy');

    // Chapter additional actions
    Route::patch('books/{book}/chapters/{chapter}/toggle-published', [ChapterController::class, 'togglePublished'])->name('books.chapters.toggle-published');
    Route::patch('books/{book}/chapters/{chapter}/toggle-free', [ChapterController::class, 'toggleFree'])->name('books.chapters.toggle-free');
    Route::patch('books/{book}/chapters/reorder', [ChapterController::class, 'reorder'])->name('books.chapters.reorder');

    // Chapter bulk actions
    Route::delete('books/{book}/chapters/bulk-delete', [ChapterController::class, 'bulkDelete'])->name('books.chapters.bulk-delete');
    Route::patch('books/{book}/chapters/bulk-publish', [ChapterController::class, 'bulkPublish'])->name('books.chapters.bulk-publish');
    Route::patch('books/{book}/chapters/bulk-unpublish', [ChapterController::class, 'bulkUnpublish'])->name('books.chapters.bulk-unpublish');
    Route::patch('books/{book}/chapters/bulk-set-free', [ChapterController::class, 'bulkSetFree'])->name('books.chapters.bulk-set-free');
    Route::patch('books/{book}/chapters/bulk-set-paid', [ChapterController::class, 'bulkSetPaid'])->name('books.chapters.bulk-set-paid');

    // Chapter Media Management
    Route::get('books/{book}/chapters/{chapter}/media', [ChapterMediaController::class, 'index'])->name('books.chapters.media.index');
    Route::post('books/{book}/chapters/{chapter}/media', [ChapterMediaController::class, 'store'])->name('books.chapters.media.store');
    Route::get('books/{book}/chapters/{chapter}/media/{media}', [ChapterMediaController::class, 'show'])->name('books.chapters.media.show');
    Route::patch('books/{book}/chapters/{chapter}/media/{media}', [ChapterMediaController::class, 'update'])->name('books.chapters.media.update');
    Route::delete('books/{book}/chapters/{chapter}/media/{media}', [ChapterMediaController::class, 'destroy'])->name('books.chapters.media.destroy');

    // Chapter Media File Operations
    Route::get('books/{book}/chapters/{chapter}/media/{media}/download', [ChapterMediaController::class, 'download'])->name('books.chapters.media.download');
    Route::post('books/{book}/chapters/{chapter}/media/{media}/replace', [ChapterMediaController::class, 'replaceFile'])->name('books.chapters.media.replace');

    // Chapter Media Bulk Operations
    Route::patch('books/{book}/chapters/{chapter}/media/reorder', [ChapterMediaController::class, 'reorder'])->name('books.chapters.media.reorder');
    Route::delete('books/{book}/chapters/{chapter}/media/bulk-delete', [ChapterMediaController::class, 'bulkDelete'])->name('books.chapters.media.bulk-delete');
    Route::patch('books/{book}/chapters/{chapter}/media/bulk-update-type', [ChapterMediaController::class, 'bulkUpdateType'])->name('books.chapters.media.bulk-update-type');

    // Chapter Media API Routes
    Route::get('books/{book}/chapters/{chapter}/media/type/{type}', [ChapterMediaController::class, 'getByType'])->name('books.chapters.media.by-type');
    Route::get('books/{book}/chapters/{chapter}/media-stats', [ChapterMediaController::class, 'getStats'])->name('books.chapters.media.stats');
    Route::post('books/{book}/chapters/{chapter}/media/upload-editor', [ChapterMediaController::class, 'uploadToEditor'])->name('books.chapters.media.upload-editor');

    // Admin Transaction Management
    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', [AdminTransactionController::class, 'index'])->name('index');
        Route::get('analytics', [TransactionAnalyticsController::class, 'index'])->name('analytics');
        Route::get('export', [AdminTransactionController::class, 'export'])->name('export');
        Route::get('{transaction}', [AdminTransactionController::class, 'show'])->name('show');
    });

    // Admin Review Management
    Route::prefix('reviews')->name('reviews.')->group(function () {
        Route::get('/', [AdminReviewController::class, 'index'])->name('index');
        Route::get('{review}', [AdminReviewController::class, 'show'])->name('show');
        Route::patch('{review}/approve', [AdminReviewController::class, 'approve'])->name('approve');
        Route::patch('{review}/reject', [AdminReviewController::class, 'reject'])->name('reject');
        Route::delete('{review}', [AdminReviewController::class, 'destroy'])->name('destroy');

        // Bulk actions
        Route::patch('bulk-approve', [AdminReviewController::class, 'bulkApprove'])->name('bulk-approve');
        Route::patch('bulk-reject', [AdminReviewController::class, 'bulkReject'])->name('bulk-reject');
        Route::delete('bulk-delete', [AdminReviewController::class, 'bulkDelete'])->name('bulk-delete');
    });

    // Admin Analytics
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('reading-progress', [ReadingProgressAnalyticsController::class, 'index'])->name('reading-progress');
        Route::get('user-engagement', [UserEngagementAnalyticsController::class, 'index'])->name('user-engagement');
    });

    // Ebooks redirect
    Route::get('ebooks', fn() => redirect()->route('admin.books.index'))->name('ebooks.index');
    Route::get('ebooks/create', fn() => redirect()->route('admin.books.create'))->name('ebooks.create');

    Route::get('settings', function () {
        return Inertia::render('admin/settings/index');
    })->name('settings');

    // Author Submission Management
    Route::prefix('author-submissions')->name('author-submissions.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\AuthorSubmissionController::class, 'index'])->name('index');
        Route::get('{submission}', [App\Http\Controllers\Admin\AuthorSubmissionController::class, 'show'])->name('show');
        Route::put('{submission}/status', [App\Http\Controllers\Admin\AuthorSubmissionController::class, 'updateStatus'])->name('update-status');
        Route::post('{submission}/approve-publish', [App\Http\Controllers\Admin\AuthorSubmissionController::class, 'approveAndPublish'])->name('approve-publish');
        Route::post('{submission}/reject', [App\Http\Controllers\Admin\AuthorSubmissionController::class, 'reject'])->name('reject');
        Route::post('{submission}/quick-approve', [App\Http\Controllers\Admin\AuthorSubmissionController::class, 'quickApprove'])->name('quick-approve');
        Route::post('{submission}/quick-reject', [App\Http\Controllers\Admin\AuthorSubmissionController::class, 'quickReject'])->name('quick-reject');
        Route::get('{submission}/download', [App\Http\Controllers\Admin\AuthorSubmissionController::class, 'downloadPdf'])->name('download');
        Route::post('bulk-update', [App\Http\Controllers\Admin\AuthorSubmissionController::class, 'bulkUpdateStatus'])->name('bulk-update');
    });
});


// =====================================================
// SEO Routes
// =====================================================
Route::get('sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');


// =====================================================
// Public API routes for reviews
// =====================================================
Route::prefix('api')->group(function () {
    // Public book reviews routes
    Route::get('books/{book:slug}/reviews', [ReviewController::class, 'bookReviews'])->name('api.reviews.book');
    Route::get('books/{book:slug}/review-stats', [ReviewController::class, 'bookStats'])->name('api.reviews.stats');

    // Authenticated review routes
    Route::middleware('auth')->group(function () {
        Route::get('books/{book:slug}/can-review', [ReviewController::class, 'canReview'])->name('api.reviews.can-review');
        Route::get('books/{book:slug}/user-review', [ReviewController::class, 'getUserBookReview'])->name('api.reviews.user-review');
        Route::post('books/{book:slug}/reviews', [ReviewController::class, 'store'])->name('api.reviews.store');
        Route::put('reviews/{review}', [ReviewController::class, 'update'])->name('api.reviews.update');
        Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])->name('api.reviews.destroy');
        Route::get('user/reviews/recent/{limit?}', [ReviewController::class, 'recentReviews'])->name('api.reviews.recent');
        Route::get('user/reviews/stats', [ReviewController::class, 'userStats'])->name('api.reviews.user-stats');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
