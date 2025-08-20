<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        // Auto-sync pending transactions on page load
        $this->autoSyncPendingTransactions();

        $query = Transaction::with(['items'])
            ->select(['id', 'transaction_code', 'type', 'total_amount', 'payment_status', 'created_at', 'expired_at', 'user_id'])
            ->where('user_id', Auth::id());

        if ($request->has('status')) {
            $query->where('payment_status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $transactions = $query->recentFirst()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    /**
     * Auto-sync pending transactions silently
     */
    private function autoSyncPendingTransactions()
    {
        try {
            $pendingTransactions = Transaction::where('user_id', Auth::id())
                ->where('payment_status', 'pending')
                ->where('created_at', '>=', now()->subDays(7)) // Only sync recent transactions
                ->get();

            foreach ($pendingTransactions as $transaction) {
                $this->syncTransactionStatus($transaction);
            }
        } catch (\Exception $e) {
            // Log but don't interrupt page loading
            Log::warning('Auto-sync failed silently', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);
        }
    }

    public function show($transactionId)
    {
        $transaction = Transaction::with(['items', 'user'])
            ->where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
        ]);
    }

    public function retry($transactionId)
    {
        $transaction = Transaction::where('id', $transactionId)
            ->where('user_id', Auth::id())
            ->where('payment_status', 'failed')
            ->firstOrFail();

        // Create new transaction with same items
        $newTransaction = Auth::user()->createTransaction($transaction->type);

        foreach ($transaction->items as $item) {
            $newTransaction->addItem(
                $item->item_type,
                $item->item_id,
                $item->item_title,
                $item->price,
                $item->quantity
            );
        }

        $newTransaction->calculateTotal();

        // Redirect to payment
        if ($transaction->type === 'book_purchase') {
            $item = $transaction->items->first();
            return redirect()->route('payment.book.show', $item->item_id);
        } else {
            $item = $transaction->items->first();
            return redirect()->route('payment.chapter.show', $item->item_id);
        }
    }

    /**
     * Sync pending transactions status automatically
     */
    public function syncPending()
    {
        $pendingTransactions = Transaction::where('user_id', Auth::id())
            ->where('payment_status', 'pending')
            ->get();

        $updated = 0;

        foreach ($pendingTransactions as $transaction) {
            if ($this->syncTransactionStatus($transaction)) {
                $updated++;
            }
        }

        return response()->json([
            'success' => true,
            'updated' => $updated,
            'message' => $updated > 0 ? "Status {$updated} transaksi berhasil diperbarui" : 'Tidak ada status yang berubah'
        ]);
    }

    /**
     * Sync all transactions status manually
     */
    public function syncAll()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->whereIn('payment_status', ['pending', 'failed'])
            ->get();

        $updated = 0;

        foreach ($transactions as $transaction) {
            if ($this->syncTransactionStatus($transaction)) {
                $updated++;
            }
        }

        return response()->json([
            'success' => true,
            'updated' => $updated,
            'message' => $updated > 0 ? "Status {$updated} transaksi berhasil diperbarui" : 'Tidak ada status yang berubah'
        ]);
    }

    /**
     * Sync individual transaction status with Midtrans
     */
    private function syncTransactionStatus(Transaction $transaction)
    {
        try {
            if (!$transaction->midtrans_order_id) {
                return false;
            }

            // Get status from Midtrans
            $status = \Midtrans\Transaction::status($transaction->midtrans_order_id);

            $oldStatus = $transaction->payment_status;

            // Update status based on Midtrans response
            switch ($status->transaction_status) {
                case 'settlement':
                    if ($oldStatus !== 'paid') {
                        $transaction->markAsPaid($status->transaction_id);
                        return true;
                    }
                    break;

                case 'pending':
                    if ($oldStatus !== 'pending') {
                        $transaction->update(['payment_status' => 'pending']);
                        return true;
                    }
                    break;

                case 'deny':
                case 'cancel':
                    if ($oldStatus !== 'failed') {
                        $transaction->markAsFailed('Payment denied/cancelled');
                        return true;
                    }
                    break;

                case 'expire':
                    if ($oldStatus !== 'expired') {
                        $transaction->markAsExpired();
                        return true;
                    }
                    break;

                case 'failure':
                    if ($oldStatus !== 'failed') {
                        $transaction->markAsFailed('Payment failed');
                        return true;
                    }
                    break;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Failed to sync transaction status', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
