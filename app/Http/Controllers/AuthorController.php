<?php

namespace App\Http\Controllers;

use App\Models\AuthorSubmission;
use App\Models\AuthorSubscriptionPlan;
use App\Models\UserAuthorSubscription;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AuthorController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * Show author pricing plans
     */
    public function pricing()
    {
        $plans = AuthorSubscriptionPlan::active()->get();

        return Inertia::render('Author/Pricing', [
            'plans' => $plans,
        ]);
    }

    /**
     * Show author dashboard
     */
    public function dashboard()
    {
        $user = Auth::user();

        $activeSubscription = $user->activeAuthorSubscription();
        $submissions = $user->authorSubmissions()
            ->with(['transaction', 'createdBook'])
            ->latest()
            ->paginate(10);

        $stats = $user->getAuthorStats();

        return Inertia::render('Author/Dashboard', [
            'activeSubscription' => $activeSubscription?->load('plan'),
            'submissions' => $submissions,
            'stats' => $stats,
        ]);
    }

    /**
     * Show submission form
     */
    public function create()
    {
        $user = Auth::user();

        if (!$user->hasActiveAuthorSubscription()) {
            return redirect()->route('author.pricing')
                ->with('error', 'Anda perlu berlangganan paket author terlebih dahulu.');
        }

        if (!$user->canSubmitBooks()) {
            return redirect()->route('author.dashboard')
                ->with('error', 'Anda telah mencapai batas maksimal submission untuk bulan ini.');
        }

        // Get categories for the dropdown
        $categories = \App\Models\Category::orderBy('name')->get();

        return Inertia::render('Author/Submit', [
            'categories' => $categories,
            'subscription' => $user->activeAuthorSubscription()->load('plan'),
        ]);
    }

    /**
     * Store new submission
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasActiveAuthorSubscription()) {
            return back()->withErrors(['error' => 'Anda perlu berlangganan paket author terlebih dahulu.']);
        }

        if (!$user->canSubmitBooks()) {
            return back()->withErrors(['error' => 'Anda telah mencapai batas maksimal submission untuk bulan ini.']);
        }

        $request->validate([
            'submission_type' => 'required|in:new_book,existing_update',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'category_slug' => 'required|string|exists:categories,slug',
            'pdf_file' => 'required|file|mimes:pdf|max:102400', // 100MB max
        ]);

        // Store the PDF file
        $pdfPath = $request->file('pdf_file')->store('author-submissions', 'public');

        // Create the submission
        $submission = AuthorSubmission::create([
            'user_id' => $user->id,
            'submission_type' => $request->submission_type,
            'title' => $request->title,
            'description' => $request->description,
            'category_slug' => $request->category_slug,
            'pdf_file_path' => $pdfPath,
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        // Increment submissions used
        $user->activeAuthorSubscription()->incrementSubmissionsUsed();

        return redirect()->route('author.dashboard')
            ->with('success', 'Submission berhasil dikirim! Tim kami akan melakukan review dalam 1-7 hari kerja.');
    }

    /**
     * Subscribe to a plan
     */
    public function subscribe(Request $request, AuthorSubscriptionPlan $plan)
    {
        $user = Auth::user();

        if ($user->hasActiveAuthorSubscription()) {
            return back()->withErrors(['error' => 'Anda sudah memiliki subscription yang aktif.']);
        }

        try {
            // Create transaction record first
            $transaction = $user->transactions()->create([
                'total_amount' => $plan->price,
                'payment_status' => 'pending',
                'payment_method' => 'midtrans',
            ]);

            // Store transaction items
            $transaction->items()->create([
                'item_type' => 'author_subscription',
                'item_id' => $plan->id,
                'item_title' => 'Author Subscription - ' . $plan->name,
                'quantity' => 1,
                'price' => $plan->price,
            ]);

            // Create Snap token using MidtransService
            $snapToken = $this->midtransService->createSnapToken($transaction);

            return Inertia::render('payment-author/checkout', [
                'snapToken' => $snapToken,
                'transaction' => $transaction,
                'items' => [
                    [
                        'title' => 'Author Subscription - ' . $plan->name,
                        'price' => $plan->price,
                        'quantity' => 1,
                    ]
                ],
                'redirectUrl' => route('author.dashboard'),
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal membuat pembayaran: ' . $e->getMessage()]);
        }
    }

    /**
     * Show author submissions list
     */
    public function submissions()
    {
        $user = Auth::user();

        $submissions = $user->authorSubmissions()
            ->with(['transaction', 'createdBook'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Author/Submissions', [
            'submissions' => $submissions,
            'stats' => $user->getAuthorStats(),
        ]);
    }

    /**
     * Show specific submission
     */
    public function show(AuthorSubmission $submission)
    {
        $user = Auth::user();

        if ($submission->user_id !== $user->id) {
            abort(403);
        }

        return Inertia::render('Author/SubmissionDetail', [
            'submission' => $submission->load(['transaction', 'createdBook', 'reviewer']),
        ]);
    }

    /**
     * Download submitted PDF
     */
    public function downloadPdf(AuthorSubmission $submission)
    {
        $user = Auth::user();

        // Validate user permission
        if ($submission->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this submission');
        }

        // Check if PDF file path exists
        if (empty($submission->pdf_file_path)) {
            abort(404, 'PDF file path not found in submission');
        }

        $filePath = Storage::disk('public')->path($submission->pdf_file_path);

        // Log for debugging
        Log::info('Download PDF Request', [
            'submission_id' => $submission->id,
            'user_id' => $user->id,
            'pdf_file_path' => $submission->pdf_file_path,
            'full_file_path' => $filePath,
            'file_exists' => file_exists($filePath),
            'file_size' => file_exists($filePath) ? filesize($filePath) : 'N/A'
        ]);

        if (!file_exists($filePath)) {
            abort(404, 'PDF file not found on disk: ' . $submission->pdf_file_path);
        }

        if (!is_readable($filePath)) {
            abort(500, 'PDF file is not readable');
        }

        // Generate safe filename
        $safeTitle = preg_replace('/[^a-zA-Z0-9_-]/', '_', $submission->title);
        $filename = $safeTitle . '.pdf';

        // Return file as stream download
        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'no-cache, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0'
        ]);
    }

    /**
     * Debug download - check submission details
     */
    public function debugDownload(AuthorSubmission $submission)
    {
        $user = Auth::user();

        $filePath = Storage::disk('public')->path($submission->pdf_file_path);

        return response()->json([
            'submission_id' => $submission->id,
            'title' => $submission->title,
            'user_id' => $submission->user_id,
            'current_user_id' => $user->id,
            'can_access' => $submission->user_id === $user->id,
            'pdf_file_path' => $submission->pdf_file_path,
            'full_file_path' => $filePath,
            'file_exists' => file_exists($filePath),
            'file_size' => file_exists($filePath) ? filesize($filePath) : 'N/A',
            'storage_path' => storage_path('app/public'),
            'public_path' => public_path('storage'),
            'storage_url' => asset('storage/' . $submission->pdf_file_path)
        ]);
    }

    /**
     * Alternative download method via storage URL
     */
    public function downloadPdfAlt(AuthorSubmission $submission)
    {
        $user = Auth::user();

        if ($submission->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized access');
        }

        if (empty($submission->pdf_file_path)) {
            return redirect()->back()->with('error', 'PDF file not found');
        }

        // Return direct storage URL
        $storageUrl = asset('storage/' . $submission->pdf_file_path);
        return redirect($storageUrl);
    }
}
