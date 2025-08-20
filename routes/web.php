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

// =====================================================
// Deployment & Maintenance Routes (Production only)
// =====================================================
Route::middleware(['web'])->group(function () {

    // Route untuk extract assets (dengan keamanan)
    Route::get('/deploy/extract-assets', function () {
        // Security check
        if (app()->environment('production') && (!request()->has('key') || request('key') !== 'ganesha2024deploy')) {
            abort(403, 'Unauthorized access');
        }

        $output = '';
        $success = false;

        $output .= view('deployment.layout', [
            'title' => '📦 Extract Assets',
            'content' => function () use (&$success) {
                $html = '';

                // Check for assets.zip
                $assetsFile = null;
                $locations = [
                    public_path('assets.zip'),
                    base_path('assets.zip'),
                    storage_path('assets.zip')
                ];

                foreach ($locations as $location) {
                    if (file_exists($location)) {
                        $assetsFile = $location;
                        break;
                    }
                }

                if (!$assetsFile) {
                    $html .= '<div class="step error">';
                    $html .= '<h3>❌ Assets.zip Not Found</h3>';
                    $html .= '<p>Please upload assets.zip to one of these locations:</p>';
                    $html .= '<ul>';
                    foreach ($locations as $location) {
                        $html .= '<li>' . $location . '</li>';
                    }
                    $html .= '</ul>';
                    $html .= '</div>';
                    return $html;
                }

                $html .= '<div class="step info">';
                $html .= '<h3>📋 Found Assets</h3>';
                $html .= '<p>File: ' . basename($assetsFile) . ' (' . round(filesize($assetsFile) / 1024 / 1024, 2) . ' MB)</p>';
                $html .= '</div>';

                // Extract if requested
                if (request()->has('extract')) {
                    $html .= '<div class="step warning">';
                    $html .= '<h3>🔄 Extracting Assets...</h3>';
                    $html .= '<pre>';

                    try {
                        // Ensure public directory exists
                        if (!is_dir(public_path())) {
                            mkdir(public_path(), 0755, true);
                            $html .= "✅ Created public directory\n";
                        }

                        // Try ZipArchive
                        if (class_exists('ZipArchive')) {
                            $zip = new ZipArchive;
                            $result = $zip->open($assetsFile);

                            if ($result === TRUE) {
                                $zip->extractTo(public_path());
                                $extractedFiles = $zip->numFiles;
                                $zip->close();
                                $html .= "✅ Successfully extracted {$extractedFiles} files with ZipArchive\n";
                                $success = true;

                                // List some extracted files
                                $extracted = glob(public_path('*'));
                                $html .= "\n📁 Extracted to public/:\n";
                                foreach (array_slice($extracted, 0, 10) as $file) {
                                    $html .= "  • " . basename($file) . "\n";
                                }
                                if (count($extracted) > 10) {
                                    $html .= "  • ... and " . (count($extracted) - 10) . " more\n";
                                }
                            } else {
                                $html .= "❌ ZipArchive failed: $result\n";
                            }
                        }

                        // Try system unzip as fallback
                        if (!$success && function_exists('exec')) {
                            $html .= "🔄 Trying system unzip...\n";
                            $command = 'unzip -o "' . $assetsFile . '" -d "' . public_path() . '"';
                            exec($command . ' 2>&1', $execOutput, $return);

                            if ($return === 0) {
                                $html .= "✅ Successfully extracted with system unzip\n";
                                $success = true;
                            } else {
                                $html .= "❌ System unzip failed:\n";
                                foreach ($execOutput as $line) {
                                    $html .= "  " . $line . "\n";
                                }
                            }
                        }

                        if ($success) {
                            $html .= "\n🎉 Extraction completed!\n";

                            // Clean up
                            if (unlink($assetsFile)) {
                                $html .= "✅ Cleaned up assets.zip\n";
                            }

                            // Clear Laravel caches
                            \Artisan::call('config:clear');
                            \Artisan::call('route:clear');
                            \Artisan::call('view:clear');
                            $html .= "✅ Cleared Laravel caches\n";
                        }
                    } catch (Exception $e) {
                        $html .= "❌ Error: " . $e->getMessage() . "\n";
                    }

                    $html .= '</pre>';
                    $html .= '</div>';

                    if ($success) {
                        $html .= '<div class="step success">';
                        $html .= '<h3>🎉 Assets Extracted Successfully!</h3>';
                        $html .= '<p>Your assets are now available. Next steps:</p>';
                        $html .= '<ol>';
                        $html .= '<li>Setup reCAPTCHA keys</li>';
                        $html .= '<li>Test your website</li>';
                        $html .= '</ol>';
                        $html .= '<a href="/deploy/recaptcha-setup?key=ganesha2024deploy" class="button">🔒 Setup reCAPTCHA</a> ';
                        $html .= '<a href="/" class="button button-blue">🌐 Visit Website</a>';
                        $html .= '</div>';
                    }
                } else {
                    $html .= '<div class="step warning">';
                    $html .= '<h3>📦 Ready to Extract</h3>';
                    $html .= '<p>Click below to extract assets.zip to public/ directory:</p>';
                    $html .= '<a href="?extract=1&key=ganesha2024deploy" class="button button-orange">🚀 Extract Assets Now</a>';
                    $html .= '</div>';
                }

                return $html;
            }
        ])->render();

        return $output;
    })->name('deploy.extract-assets');

    // Route untuk setup reCAPTCHA
    Route::get('/deploy/recaptcha-setup', function () {
        // Security check
        if (app()->environment('production') && (!request()->has('key') || request('key') !== 'ganesha2024deploy')) {
            abort(403, 'Unauthorized access');
        }

        return view('deployment.layout', [
            'title' => '🔒 reCAPTCHA Setup',
            'content' => function () {
                $html = '';

                // Check current status
                $envPath = base_path('.env');
                $envContent = file_exists($envPath) ? file_get_contents($envPath) : '';
                $hasSiteKey = strpos($envContent, 'RECAPTCHA_SITE_KEY=') !== false &&
                    !empty(trim(str_replace(
                        ['RECAPTCHA_SITE_KEY=', '"'],
                        '',
                        preg_match('/RECAPTCHA_SITE_KEY=(.*)/', $envContent, $matches) ? $matches[1] : ''
                    )));
                $hasSecretKey = strpos($envContent, 'RECAPTCHA_SECRET_KEY=') !== false &&
                    !empty(trim(str_replace(
                        ['RECAPTCHA_SECRET_KEY=', '"'],
                        '',
                        preg_match('/RECAPTCHA_SECRET_KEY=(.*)/', $envContent, $matches) ? $matches[1] : ''
                    )));

                $html .= '<div class="step info">';
                $html .= '<h3>📋 Current Status</h3>';
                $html .= '<strong>Environment file:</strong> ' . (file_exists($envPath) ? '✅ Found' : '❌ Missing') . '<br>';
                $html .= '<strong>reCAPTCHA Site Key:</strong> ' . ($hasSiteKey ? '✅ Configured' : '❌ Missing') . '<br>';
                $html .= '<strong>reCAPTCHA Secret Key:</strong> ' . ($hasSecretKey ? '✅ Configured' : '❌ Missing') . '<br>';
                $html .= '</div>';

                // Handle form submission
                if (request()->has('setup') && request()->has('site_key') && request()->has('secret_key')) {
                    $siteKey = trim(request('site_key'));
                    $secretKey = trim(request('secret_key'));

                    if (empty($siteKey) || empty($secretKey)) {
                        $html .= '<div class="step error">';
                        $html .= '<h3>❌ Error</h3>';
                        $html .= '<p>Please provide both Site Key and Secret Key!</p>';
                        $html .= '</div>';
                    } else {
                        try {
                            // Update .env file
                            $envContent = preg_replace('/^RECAPTCHA_SITE_KEY=.*$/m', '', $envContent);
                            $envContent = preg_replace('/^RECAPTCHA_SECRET_KEY=.*$/m', '', $envContent);
                            $envContent = trim($envContent) . "\n\n# reCAPTCHA Configuration\n";
                            $envContent .= "RECAPTCHA_SITE_KEY={$siteKey}\n";
                            $envContent .= "RECAPTCHA_SECRET_KEY={$secretKey}\n";

                            if (file_put_contents($envPath, $envContent)) {
                                $html .= '<div class="step success">';
                                $html .= '<h3>✅ reCAPTCHA Setup Complete!</h3>';
                                $html .= '<p>Keys saved successfully:</p>';
                                $html .= '<p><strong>Site Key:</strong> ' . substr($siteKey, 0, 20) . '...</p>';
                                $html .= '<p><strong>Secret Key:</strong> ' . substr($secretKey, 0, 20) . '...</p>';

                                // Clear config cache
                                \Artisan::call('config:clear');
                                $html .= '<p>✅ Config cache cleared</p>';
                                $html .= '</div>';

                                $hasSiteKey = true;
                                $hasSecretKey = true;
                            } else {
                                $html .= '<div class="step error">';
                                $html .= '<h3>❌ Failed to Save</h3>';
                                $html .= '<p>Could not write to .env file. Check permissions.</p>';
                                $html .= '</div>';
                            }
                        } catch (Exception $e) {
                            $html .= '<div class="step error">';
                            $html .= '<h3>❌ Error</h3>';
                            $html .= '<p>' . $e->getMessage() . '</p>';
                            $html .= '</div>';
                        }
                    }
                }

                if (!$hasSiteKey || !$hasSecretKey) {
                    $html .= '<div class="step info">';
                    $html .= '<h3>📖 How to Get reCAPTCHA Keys</h3>';
                    $html .= '<ol>';
                    $html .= '<li>Go to <a href="https://www.google.com/recaptcha/admin/create" target="_blank"><strong>Google reCAPTCHA Console</strong></a></li>';
                    $html .= '<li>Create new site with these domains:</li>';
                    $html .= '</ol>';
                    $html .= '<div style="background:#f8f9fa;padding:10px;border-radius:4px;font-family:monospace;">';
                    $html .= 'ganeshainstitute.org<br>www.ganeshainstitute.org<br>145.79.14.156';
                    $html .= '</div>';
                    $html .= '</div>';

                    $html .= '<div class="step warning">';
                    $html .= '<h3>🔧 Enter reCAPTCHA Keys</h3>';
                    $html .= '<form method="GET">';
                    $html .= '<input type="hidden" name="key" value="ganesha2024deploy">';
                    $html .= '<div class="form-group">';
                    $html .= '<label>Site Key:</label>';
                    $html .= '<input type="text" name="site_key" placeholder="6Lc..." required>';
                    $html .= '</div>';
                    $html .= '<div class="form-group">';
                    $html .= '<label>Secret Key:</label>';
                    $html .= '<input type="text" name="secret_key" placeholder="6Lc..." required>';
                    $html .= '</div>';
                    $html .= '<button type="submit" name="setup" value="1" class="button">🔒 Setup reCAPTCHA</button>';
                    $html .= '</form>';
                    $html .= '</div>';
                } else {
                    $html .= '<div class="step success">';
                    $html .= '<h3>🎉 All Set!</h3>';
                    $html .= '<p>reCAPTCHA is configured. Test your website:</p>';
                    $html .= '<a href="/login" class="button">🧪 Test Login</a> ';
                    $html .= '<a href="/" class="button">🌐 Homepage</a>';
                    $html .= '</div>';
                }

                return $html;
            }
        ])->render();
    })->name('deploy.recaptcha-setup');

    // Route untuk status deployment
    Route::get('/deploy/status', function () {
        if (app()->environment('production') && (!request()->has('key') || request('key') !== 'ganesha2024deploy')) {
            abort(403, 'Unauthorized access');
        }

        return view('deployment.layout', [
            'title' => '📊 Deployment Status',
            'content' => function () {
                $html = '';

                // Check various components
                $checks = [
                    'Laravel Framework' => class_exists('Illuminate\Foundation\Application'),
                    'Environment File' => file_exists(base_path('.env')),
                    'Public Directory' => is_dir(public_path()),
                    'Storage Writable' => is_writable(storage_path()),
                    'Assets Extracted' => file_exists(public_path('build')) || file_exists(public_path('css')),
                    'Storage Linked' => file_exists(public_path('storage')),
                    'Config Cached' => file_exists(bootstrap_path('cache/config.php')),
                    'Routes Cached' => file_exists(bootstrap_path('cache/routes-v7.php')),
                ];

                $html .= '<div class="status-grid">';
                foreach ($checks as $check => $status) {
                    $html .= '<div class="status-card ' . ($status ? 'status-ok' : 'status-error') . '">';
                    $html .= '<h4>' . ($status ? '✅' : '❌') . ' ' . $check . '</h4>';
                    $html .= '<p>' . ($status ? 'OK' : 'Failed') . '</p>';
                    $html .= '</div>';
                }
                $html .= '</div>';

                // Environment info
                $html .= '<div class="step info">';
                $html .= '<h3>🔧 Environment Info</h3>';
                $html .= '<ul>';
                $html .= '<li><strong>PHP Version:</strong> ' . PHP_VERSION . '</li>';
                $html .= '<li><strong>Laravel Version:</strong> ' . app()->version() . '</li>';
                $html .= '<li><strong>Environment:</strong> ' . app()->environment() . '</li>';
                $html .= '<li><strong>Debug Mode:</strong> ' . (config('app.debug') ? 'ON' : 'OFF') . '</li>';
                $html .= '</ul>';
                $html .= '</div>';

                return $html;
            }
        ])->render();
    })->name('deploy.status');

    // Route untuk debug reCAPTCHA
    Route::get('/debug/recaptcha', function () {
        if (!request()->has('key') || request('key') !== 'ganesha2024deploy') {
            abort(403, 'Unauthorized');
        }

        return view('deployment.layout', [
            'title' => '🔍 reCAPTCHA Debug',
            'content' => function () {
                $html = '';

                // 1. Check environment variables
                $html .= '<div class="step info">';
                $html .= '<h3>📋 Environment Variables</h3>';
                $html .= '<pre>';
                $html .= 'APP_NAME: ' . config('app.name') . "\n";
                $html .= 'APP_ENV: ' . app()->environment() . "\n";
                $html .= 'RECAPTCHA_SITE_KEY: ' . (env('RECAPTCHA_SITE_KEY') ? substr(env('RECAPTCHA_SITE_KEY'), 0, 20) . '...' : 'NOT_SET') . "\n";
                $html .= 'RECAPTCHA_SECRET_KEY: ' . (env('RECAPTCHA_SECRET_KEY') ? substr(env('RECAPTCHA_SECRET_KEY'), 0, 20) . '...' : 'NOT_SET') . "\n";
                $html .= 'Config Cached: ' . (file_exists(bootstrap_path('cache/config.php')) ? 'YES' : 'NO') . "\n";
                $html .= '</pre>';
                $html .= '</div>';

                // 2. Check .env file content
                $envPath = base_path('.env');
                if (file_exists($envPath)) {
                    $envContent = file_get_contents($envPath);
                    $html .= '<div class="step info">';
                    $html .= '<h3>📄 .env File reCAPTCHA Lines</h3>';
                    $html .= '<pre>';

                    $lines = explode("\n", $envContent);
                    foreach ($lines as $line) {
                        if (strpos($line, 'RECAPTCHA') !== false || strpos($line, 'APP_NAME') !== false) {
                            $html .= $line . "\n";
                        }
                    }
                    $html .= '</pre>';
                    $html .= '</div>';
                }

                // 3. Test reCAPTCHA API directly
                if (request()->has('test_api')) {
                    $html .= '<div class="step warning">';
                    $html .= '<h3>🧪 API Test Results</h3>';
                    $html .= '<pre>';

                    $siteKey = env('RECAPTCHA_SITE_KEY');
                    $secretKey = env('RECAPTCHA_SECRET_KEY');

                    if ($siteKey && $secretKey) {
                        $html .= "Testing with:\n";
                        $html .= "Site Key: " . substr($siteKey, 0, 20) . "...\n";
                        $html .= "Secret Key: " . substr($secretKey, 0, 20) . "...\n\n";

                        // Test API endpoint
                        try {
                            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                                'secret' => $secretKey,
                                'response' => 'test-token',
                                'remoteip' => request()->ip()
                            ]);

                            $result = $response->json();
                            $html .= "API Response:\n";
                            $html .= json_encode($result, JSON_PRETTY_PRINT) . "\n";

                            if (isset($result['error-codes'])) {
                                $html .= "\n❌ Error Codes Found:\n";
                                foreach ($result['error-codes'] as $error) {
                                    switch ($error) {
                                        case 'missing-input-secret':
                                            $html .= "- Missing secret key\n";
                                            break;
                                        case 'invalid-input-secret':
                                            $html .= "- Invalid secret key (check if you're using site key instead)\n";
                                            break;
                                        case 'missing-input-response':
                                            $html .= "- Missing response token (normal for test)\n";
                                            break;
                                        case 'invalid-input-response':
                                            $html .= "- Invalid response token (normal for test)\n";
                                            break;
                                        default:
                                            $html .= "- " . $error . "\n";
                                    }
                                }
                            }
                        } catch (Exception $e) {
                            $html .= "❌ API Test Failed: " . $e->getMessage() . "\n";
                        }
                    } else {
                        $html .= "❌ Keys not found in environment\n";
                    }

                    $html .= '</pre>';
                    $html .= '</div>';
                } else {
                    $html .= '<div class="step info">';
                    $html .= '<p><a href="?key=ganesha2024deploy&test_api=1" class="button">🧪 Test API Connection</a></p>';
                    $html .= '</div>';
                }

                // 4. Config cache actions
                if (request()->has('clear_cache')) {
                    $html .= '<div class="step warning">';
                    $html .= '<h3>🧹 Clearing Caches...</h3>';
                    $html .= '<pre>';
                    try {
                        \Artisan::call('config:clear');
                        $html .= "✅ Config cache cleared\n";

                        \Artisan::call('route:clear');
                        $html .= "✅ Route cache cleared\n";

                        \Artisan::call('view:clear');
                        $html .= "✅ View cache cleared\n";

                        \Artisan::call('cache:clear');
                        $html .= "✅ Application cache cleared\n";

                        $html .= "\n🎉 All caches cleared! Please test login again.\n";
                    } catch (Exception $e) {
                        $html .= "❌ Cache clear failed: " . $e->getMessage() . "\n";
                    }
                    $html .= '</pre>';
                    $html .= '</div>';
                } else {
                    $html .= '<div class="step info">';
                    $html .= '<p><a href="?key=ganesha2024deploy&clear_cache=1" class="button button-orange">🧹 Clear All Caches</a></p>';
                    $html .= '</div>';
                }

                // 5. Quick actions
                $html .= '<div class="step info">';
                $html .= '<h3>🔧 Quick Actions</h3>';
                $html .= '<a href="/deploy/recaptcha-setup?key=ganesha2024deploy" class="button">🔒 Setup reCAPTCHA</a> ';
                $html .= '<a href="/login" class="button button-blue">🧪 Test Login</a> ';
                $html .= '<a href="/" class="button">🌐 Homepage</a>';
                $html .= '</div>';

                return $html;
            }
        ])->render();
    })->name('debug.recaptcha');
});
