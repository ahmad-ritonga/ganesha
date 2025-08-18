<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['items'])
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
            return redirect()->route('payment.book', $item->item_id);
        } else {
            $item = $transaction->items->first();
            return redirect()->route('payment.chapter', $item->item_id);
        }
    }
}
