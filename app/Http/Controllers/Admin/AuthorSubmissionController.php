<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuthorSubmission;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AuthorSubmissionController extends Controller
{
    /**
     * Display listing of submissions
     */
    public function index(Request $request)
    {
        $query = AuthorSubmission::with(['user', 'transaction'])
            ->latest();

        // Filter by status if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by title or user name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $submissions = $query->paginate(20);

        return Inertia::render('admin/AuthorSubmissions/Index', [
            'submissions' => $submissions,
            'filters' => [
                'status' => $request->status,
                'search' => $request->search,
            ],
            'stats' => [
                'total' => AuthorSubmission::count(),
                'pending' => AuthorSubmission::where('status', 'pending')->count(),
                'under_review' => AuthorSubmission::where('status', 'under_review')->count(),
                'approved' => AuthorSubmission::where('status', 'approved')->count(),
                'rejected' => AuthorSubmission::where('status', 'rejected')->count(),
                'published' => AuthorSubmission::where('status', 'published')->count(),
            ],
        ]);
    }

    /**
     * Show submission details
     */
    public function show(AuthorSubmission $submission)
    {
        $submission->load(['user', 'transaction', 'createdBook', 'reviewer']);

        return Inertia::render('admin/AuthorSubmissions/Show', [
            'submission' => $submission,
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Update submission status
     */
    public function updateStatus(Request $request, AuthorSubmission $submission)
    {
        $request->validate([
            'status' => 'required|in:pending,under_review,approved,rejected,published',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $submission->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => Auth::id(),
        ]);

        return back()->with('success', 'Status submission berhasil diperbarui.');
    }

    /**
     * Approve and convert to book
     */
    public function approveAndPublish(Request $request, AuthorSubmission $submission)
    {
        $request->validate([
            'category_slug' => 'required|string|exists:categories,slug',
            'price' => 'required|numeric|min:0',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if ($submission->status !== 'approved') {
            return back()->withErrors(['error' => 'Submission harus di-approve terlebih dahulu.']);
        }

        try {
            // Create book from submission
            $book = Book::create([
                'title' => $submission->title,
                'description' => $submission->description,
                'author_id' => $submission->user_id,
                'category_slug' => $request->category_slug,
                'price' => $request->price,
                'cover_image' => null, // TODO: Generate or allow admin to upload cover
                'is_published' => true,
                'published_at' => now(),
            ]);

            // TODO: Process PDF and create chapters
            // This would involve parsing the PDF and creating chapters
            // For now, we'll create a single chapter with the PDF content

            $submission->update([
                'status' => 'published',
                'created_book_id' => $book->id,
                'admin_notes' => $request->admin_notes,
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id(),
            ]);

            return back()->with('success', 'Submission berhasil dipublikasikan sebagai buku.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mempublikasikan buku: ' . $e->getMessage()]);
        }
    }

    /**
     * Reject submission
     */
    public function reject(Request $request, AuthorSubmission $submission)
    {
        $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        $submission->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => Auth::id(),
        ]);

        return back()->with('success', 'Submission berhasil ditolak.');
    }

    /**
     * Download submitted PDF
     */
    public function downloadPdf(AuthorSubmission $submission)
    {
        // Check if PDF file path exists
        if (empty($submission->pdf_file_path)) {
            abort(404, 'PDF file path not found in submission');
        }

        $filePath = Storage::disk('public')->path($submission->pdf_file_path);

        if (!file_exists($filePath)) {
            abort(404, 'PDF file not found on disk: ' . $submission->pdf_file_path);
        }

        if (!is_readable($filePath)) {
            abort(500, 'PDF file is not readable');
        }

        // Generate safe filename
        $safeTitle = preg_replace('/[^a-zA-Z0-9_-]/', '_', $submission->title);
        $filename = $safeTitle . '.pdf';

        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'no-cache, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0'
        ]);
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'submission_ids' => 'required|array',
            'submission_ids.*' => 'exists:author_submissions,id',
            'status' => 'required|in:pending,under_review,approved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        AuthorSubmission::whereIn('id', $request->submission_ids)
            ->update([
                'status' => $request->status,
                'admin_notes' => $request->admin_notes,
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id(),
            ]);

        $count = count($request->submission_ids);
        return back()->with('success', "{$count} submission berhasil diperbarui.");
    }

    /**
     * Quick approve submission
     */
    public function quickApprove(AuthorSubmission $submission)
    {
        $submission->update([
            'status' => 'approved',
            'admin_notes' => 'Quick approved by admin',
            'reviewed_at' => now(),
            'reviewed_by' => Auth::id(),
        ]);

        return back()->with('success', 'Submission berhasil disetujui.');
    }

    /**
     * Quick reject submission  
     */
    public function quickReject(AuthorSubmission $submission)
    {
        $submission->update([
            'status' => 'rejected',
            'admin_notes' => 'Quick rejected by admin',
            'reviewed_at' => now(),
            'reviewed_by' => Auth::id(),
        ]);

        return back()->with('success', 'Submission berhasil ditolak.');
    }
}
