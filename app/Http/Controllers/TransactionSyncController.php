<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TransactionSyncController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    public function syncTransaction(Transaction $transaction)
    {
        try {
            if ($transaction->payment_status === 'paid') {
                return response()->json([
                    'success' => true,
                    'message' => 'Transaction already paid',
                    'status' => $transaction->payment_status
                ]);
            }

            // Get order ID for Midtrans check
            $orderId = $transaction->midtrans_order_id ?: $transaction->transaction_code;

            // Get status from Midtrans
            $midtransStatus = $this->midtransService->getTransactionStatus($orderId);

            Log::info('Manual sync transaction status', [
                'transaction_id' => $transaction->id,
                'order_id' => $orderId,
                'midtrans_status' => $midtransStatus
            ]);

            // Update transaction based on Midtrans status
            $this->updateTransactionFromMidtransStatus($transaction, $midtransStatus);

            return response()->json([
                'success' => true,
                'message' => 'Transaction status updated successfully',
                'status' => $transaction->fresh()->payment_status,
                'midtrans_status' => $midtransStatus->transaction_status ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to sync transaction', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to sync transaction: ' . $e->getMessage()
            ], 500);
        }
    }

    public function syncAllPendingTransactions()
    {
        try {
            $pendingTransactions = Transaction::where('payment_status', 'pending')
                ->where('created_at', '>=', now()->subDays(7)) // Only check transactions from last 7 days
                ->get();

            $results = [];

            foreach ($pendingTransactions as $transaction) {
                try {
                    $orderId = $transaction->midtrans_order_id ?: $transaction->transaction_code;
                    $midtransStatus = $this->midtransService->getTransactionStatus($orderId);

                    $oldStatus = $transaction->payment_status;
                    $this->updateTransactionFromMidtransStatus($transaction, $midtransStatus);

                    $results[] = [
                        'transaction_id' => $transaction->id,
                        'transaction_code' => $transaction->transaction_code,
                        'old_status' => $oldStatus,
                        'new_status' => $transaction->fresh()->payment_status,
                        'midtrans_status' => $midtransStatus->transaction_status ?? null
                    ];
                } catch (\Exception $e) {
                    $results[] = [
                        'transaction_id' => $transaction->id,
                        'transaction_code' => $transaction->transaction_code,
                        'error' => $e->getMessage()
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Bulk sync completed',
                'results' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to sync all pending transactions', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to sync transactions: ' . $e->getMessage()
            ], 500);
        }
    }

    private function updateTransactionFromMidtransStatus(Transaction $transaction, $midtransStatus)
    {
        $transactionStatus = $midtransStatus->transaction_status ?? null;
        $fraudStatus = $midtransStatus->fraud_status ?? null;
        $paymentType = $midtransStatus->payment_type ?? null;

        switch ($transactionStatus) {
            case 'capture':
                if ($paymentType == 'credit_card') {
                    if ($fraudStatus == 'challenge') {
                        $transaction->update(['payment_status' => 'pending']);
                    } else if ($fraudStatus == 'accept') {
                        $transaction->markAsPaid($midtransStatus->transaction_id);
                    }
                }
                break;

            case 'settlement':
                $transaction->markAsPaid($midtransStatus->transaction_id);
                break;

            case 'pending':
                // Keep as pending
                break;

            case 'deny':
            case 'cancel':
                $transaction->markAsFailed('Payment denied/cancelled by Midtrans');
                break;

            case 'expire':
                $transaction->markAsExpired();
                break;

            case 'failure':
                $transaction->markAsFailed('Payment failed');
                break;

            default:
                Log::warning('Unknown transaction status from Midtrans sync', [
                    'transaction_id' => $transaction->id,
                    'status' => $transactionStatus
                ]);
                break;
        }
    }
}
