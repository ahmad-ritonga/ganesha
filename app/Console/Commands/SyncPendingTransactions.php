<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SyncPendingTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'transactions:sync-pending 
                           {--days=7 : Number of days to look back for pending transactions}
                           {--batch=50 : Number of transactions to process in each batch}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync pending transaction statuses with Midtrans';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $batchSize = $this->option('batch');

        $this->info("Syncing pending transactions from the last {$days} days...");

        $pendingTransactions = Transaction::where('payment_status', 'pending')
            ->where('created_at', '>=', now()->subDays($days))
            ->whereNotNull('midtrans_order_id')
            ->take($batchSize)
            ->get();

        if ($pendingTransactions->isEmpty()) {
            $this->info('No pending transactions found to sync.');
            return 0;
        }

        $this->info("Found {$pendingTransactions->count()} pending transactions to sync.");

        $updated = 0;
        $errors = 0;

        foreach ($pendingTransactions as $transaction) {
            try {
                if ($this->syncTransactionStatus($transaction)) {
                    $updated++;
                    $this->line("✓ Updated transaction {$transaction->transaction_code}");
                } else {
                    $this->line("- No change for transaction {$transaction->transaction_code}");
                }
            } catch (\Exception $e) {
                $errors++;
                $this->error("✗ Failed to sync transaction {$transaction->transaction_code}: {$e->getMessage()}");

                Log::error('Transaction sync failed', [
                    'transaction_id' => $transaction->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("\nSync completed:");
        $this->info("- Updated: {$updated}");
        $this->info("- Errors: {$errors}");
        $this->info("- Total processed: {$pendingTransactions->count()}");

        return 0;
    }

    /**
     * Sync individual transaction status with Midtrans
     */
    private function syncTransactionStatus(Transaction $transaction): bool
    {
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
                // Status is already pending, no change needed
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
    }
}
