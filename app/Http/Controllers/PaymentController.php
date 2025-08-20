<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Chapter;
use App\Models\Transaction;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    public function showBookPayment(Request $request, $bookId)
    {
        try {
            $book = Book::with('author')->findOrFail($bookId);
            $user = Auth::user();

            // Check if already purchased
            if ($user->hasPurchasedBook($book->id)) {
                return redirect()->route('books.show', $book->slug)
                    ->with('error', 'Anda sudah memiliki buku ini.');
            }

            return Inertia::render('payment/book', [
                'book' => $book,
            ]);
        } catch (\Exception $e) {
            Log::error('Show book payment failed', [
                'book_id' => $bookId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function purchaseBook(Request $request, $bookId)
    {
        try {
            $book = Book::findOrFail($bookId);
            $user = Auth::user();

            // Check if already purchased
            if ($user->hasPurchasedBook($book->id)) {
                return back()->with('error', 'Anda sudah memiliki buku ini.');
            }

            // Create transaction
            $transaction = $user->purchaseBook($book);

            // Create Snap token
            $snapToken = $this->midtransService->createSnapToken($transaction);

            return Inertia::render('payment/checkout', [
                'transaction' => $transaction->load('items'),
                'book' => $book,
                'snapToken' => $snapToken,
                'clientKey' => config('services.midtrans.client_key'),
            ]);
        } catch (\Exception $e) {
            Log::error('Book purchase failed', [
                'book_id' => $bookId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function showChapterPayment(Request $request, $chapterId)
    {
        try {
            $chapter = Chapter::with(['book.author'])->findOrFail($chapterId);
            $user = Auth::user();

            // Check if chapter is free
            if ($chapter->is_free) {
                return redirect()->route('books.read-chapter', [$chapter->book->slug, $chapter->slug])
                    ->with('info', 'Chapter ini gratis, Anda bisa langsung membacanya.');
            }

            // Check if already purchased
            if ($user->hasPurchasedChapter($chapter->id)) {
                return redirect()->route('books.read-chapter', [$chapter->book->slug, $chapter->slug])
                    ->with('info', 'Anda sudah memiliki chapter ini.');
            }

            // Check if already has book access
            if ($user->hasPurchasedBook($chapter->book_id)) {
                return redirect()->route('books.read-chapter', [$chapter->book->slug, $chapter->slug])
                    ->with('info', 'Anda sudah memiliki akses melalui pembelian buku.');
            }

            return Inertia::render('payment/chapter', [
                'chapter' => $chapter,
                'book' => $chapter->book,
            ]);
        } catch (\Exception $e) {
            Log::error('Show chapter payment failed', [
                'chapter_id' => $chapterId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function purchaseChapter(Request $request, $chapterId)
    {
        try {
            $chapter = Chapter::with(['book.author'])->findOrFail($chapterId);
            $user = Auth::user();

            // Check if chapter is free
            if ($chapter->is_free) {
                return back()->with('error', 'Chapter ini gratis, tidak perlu dibeli.');
            }

            // Check if already purchased
            if ($user->hasPurchasedChapter($chapter->id)) {
                return back()->with('error', 'Anda sudah memiliki chapter ini.');
            }

            // Check if already has book access
            if ($user->hasPurchasedBook($chapter->book_id)) {
                return back()->with('error', 'Anda sudah memiliki akses melalui pembelian buku.');
            }

            // Create transaction
            $transaction = $user->purchaseChapter($chapter);

            // Create Snap token
            $snapToken = $this->midtransService->createSnapToken($transaction);

            return Inertia::render('payment/checkout', [
                'transaction' => $transaction->load('items'),
                'chapter' => $chapter,
                'book' => $chapter->book,
                'snapToken' => $snapToken,
                'clientKey' => config('services.midtrans.client_key'),
            ]);
        } catch (\Exception $e) {
            Log::error('Chapter purchase failed', [
                'chapter_id' => $chapterId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function success(Request $request, $transactionId)
    {
        $transaction = Transaction::with(['items', 'user'])
            ->where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('payment/success', [
            'transaction' => $transaction,
        ]);
    }

    public function failed(Request $request, $transactionId)
    {
        $transaction = Transaction::with(['items', 'user'])
            ->where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('payment/failed', [
            'transaction' => $transaction,
        ]);
    }

    public function pending(Request $request, $transactionId)
    {
        $transaction = Transaction::with(['items', 'user'])
            ->where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('payment/pending', [
            'transaction' => $transaction,
        ]);
    }

    public function checkStatus(Request $request, $transactionId)
    {
        try {
            $transaction = Transaction::where('id', $transactionId)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            // Get status from Midtrans
            $status = $this->midtransService->getTransactionStatus($transaction->midtrans_order_id);

            // Update transaction based on Midtrans status
            switch ($status->transaction_status) {
                case 'settlement':
                case 'capture':
                    if ($transaction->isPending()) {
                        $transaction->markAsPaid($status->transaction_id);
                    }
                    break;
                case 'expire':
                    if ($transaction->isPending()) {
                        $transaction->markAsExpired();
                    }
                    break;
                case 'cancel':
                case 'deny':
                case 'failure':
                    if ($transaction->isPending()) {
                        $transaction->markAsFailed('Payment failed');
                    }
                    break;
            }

            return response()->json([
                'status' => $transaction->fresh()->payment_status,
                'transaction' => $transaction->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Check payment status failed', [
                'transaction_id' => $transactionId,
                'error' => $e->getMessage()
            ]);

            return response()->json(['error' => 'Failed to check status'], 500);
        }
    }

    public function cancel(Request $request, $transactionId)
    {
        try {
            $transaction = Transaction::where('id', $transactionId)
                ->where('user_id', Auth::id())
                ->where('payment_status', 'pending')
                ->firstOrFail();

            // Cancel transaction in Midtrans
            if ($transaction->midtrans_order_id) {
                $this->midtransService->cancelTransaction($transaction->midtrans_order_id);
            }

            // Mark as failed
            $transaction->markAsFailed('Cancelled by user');

            return redirect()->route('payment.failed', $transaction->id)
                ->with('message', 'Pembayaran dibatalkan.');
        } catch (\Exception $e) {
            Log::error('Cancel payment failed', [
                'transaction_id' => $transactionId,
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Gagal membatalkan pembayaran.');
        }
    }

    public function continuePayment(Request $request, $transactionId)
    {
        try {
            $transaction = Transaction::with(['items', 'user'])
                ->where('id', $transactionId)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            // Check if transaction can still be paid
            if (!$transaction->canBePaid()) {
                if ($transaction->isExpired()) {
                    return redirect()->route('payment.failed', $transaction->id)
                        ->with('error', 'Transaksi sudah kadaluarsa. Silakan buat transaksi baru.');
                } else if ($transaction->isPaid()) {
                    return redirect()->route('payment.success', $transaction->id)
                        ->with('message', 'Transaksi sudah berhasil dibayar.');
                } else {
                    return redirect()->route('payment.failed', $transaction->id)
                        ->with('error', 'Transaksi tidak dapat dilanjutkan.');
                }
            }

            // Create new Snap token if needed
            $snapToken = $this->midtransService->createSnapToken($transaction);

            // Get related book/chapter for display
            $firstItem = $transaction->items->first();
            $book = null;
            $chapter = null;

            if ($firstItem && $firstItem->item_type === 'App\Models\Book') {
                $book = Book::find($firstItem->item_id);
            } elseif ($firstItem && $firstItem->item_type === 'App\Models\Chapter') {
                $chapter = Chapter::with(['book'])->find($firstItem->item_id);
                $book = $chapter->book ?? null;
            }

            return Inertia::render('payment/checkout', [
                'transaction' => $transaction,
                'book' => $book,
                'chapter' => $chapter,
                'snapToken' => $snapToken,
                'clientKey' => config('services.midtrans.client_key'),
            ]);
        } catch (\Exception $e) {
            Log::error('Continue payment failed', [
                'transaction_id' => $transactionId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Gagal melanjutkan pembayaran: ' . $e->getMessage());
        }
    }
}
