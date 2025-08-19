<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use App\Models\UserPurchase;
use Illuminate\Console\Command;

class CheckUserPurchases extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'purchases:check {transaction_code?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and fix user purchases for paid transactions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $transactionCode = $this->argument('transaction_code');

        if ($transactionCode) {
            // Check specific transaction
            $transaction = Transaction::where('transaction_code', $transactionCode)->first();

            if (!$transaction) {
                $this->error("Transaction not found: {$transactionCode}");
                return;
            }

            $this->checkSingleTransaction($transaction);
        } else {
            // Check all paid transactions without purchases
            $this->checkAllTransactions();
        }
    }

    private function checkSingleTransaction($transaction)
    {
        $this->info("Checking transaction: {$transaction->transaction_code}");
        $this->info("Status: {$transaction->payment_status}");
        $this->info("User ID: {$transaction->user_id}");
        $this->info("Total: {$transaction->total_amount}");

        // Check transaction items
        $this->info("Transaction Items:");
        foreach ($transaction->items as $item) {
            $this->info("  - {$item->item_type}: {$item->item_id} (Qty: {$item->quantity}, Price: {$item->price})");
        }

        // Check existing purchases
        $purchases = UserPurchase::where('user_id', $transaction->user_id)->get();
        $this->info("\nExisting User Purchases:");
        foreach ($purchases as $purchase) {
            $this->info("  - {$purchase->purchasable_type}: {$purchase->purchasable_id} (Transaction: {$purchase->transaction_id})");
        }

        // If transaction is paid but no purchases exist, create them
        if ($transaction->payment_status === 'paid') {
            $this->info("\nTransaction is paid. Creating missing purchases...");
            $transaction->createUserPurchases();
            $this->info("Purchases created successfully!");
        }
    }

    private function checkAllTransactions()
    {
        $paidTransactions = Transaction::where('payment_status', 'paid')
            ->whereDoesntHave('userPurchases')
            ->with('items')
            ->get();

        if ($paidTransactions->isEmpty()) {
            $this->info("No paid transactions without purchases found.");
            return;
        }

        $this->info("Found {$paidTransactions->count()} paid transactions without purchases:");

        foreach ($paidTransactions as $transaction) {
            $this->info("- {$transaction->transaction_code} (User: {$transaction->user_id})");
            $transaction->createUserPurchases();
        }

        $this->info("All missing purchases have been created!");
    }
}
