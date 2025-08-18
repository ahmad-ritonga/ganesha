<?php

namespace App\Services;

use App\Models\Transaction;
use Midtrans\Snap;
use Midtrans\Notification;
use Illuminate\Support\Facades\Log;

class MidtransService
{
    public function createSnapToken(Transaction $transaction)
    {
        try {
            // Set order ID for Midtrans
            if (!$transaction->midtrans_order_id) {
                $transaction->update([
                    'midtrans_order_id' => $transaction->transaction_code . '-' . time()
                ]);
            }

            $payload = $transaction->getMidtransPayload();

            Log::info('Creating Midtrans Snap Token', [
                'transaction_id' => $transaction->id,
                'payload' => $payload
            ]);

            $snapToken = Snap::getSnapToken($payload);

            Log::info('Midtrans Snap Token Created', [
                'transaction_id' => $transaction->id,
                'snap_token' => $snapToken
            ]);

            return $snapToken;
        } catch (\Exception $e) {
            Log::error('Failed to create Midtrans Snap Token', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    public function handleNotification()
    {
        try {
            $notification = new Notification();

            Log::info('Midtrans Notification Received', [
                'order_id' => $notification->order_id,
                'status_code' => $notification->status_code,
                'transaction_status' => $notification->transaction_status,
                'payment_type' => $notification->payment_type,
            ]);

            $orderId = $notification->order_id;
            $transactionStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status ?? null;
            $paymentType = $notification->payment_type;

            // Find transaction by order ID
            $transaction = Transaction::where('midtrans_order_id', $orderId)
                ->orWhere('transaction_code', $orderId)
                ->first();

            if (!$transaction) {
                Log::error('Transaction not found for Midtrans notification', [
                    'order_id' => $orderId
                ]);
                return false;
            }

            // Handle different transaction statuses
            switch ($transactionStatus) {
                case 'capture':
                    if ($paymentType == 'credit_card') {
                        if ($fraudStatus == 'challenge') {
                            $transaction->update(['payment_status' => 'pending']);
                        } else if ($fraudStatus == 'accept') {
                            $transaction->markAsPaid($notification->transaction_id);
                        }
                    }
                    break;

                case 'settlement':
                    $transaction->markAsPaid($notification->transaction_id);
                    break;

                case 'pending':
                    $transaction->update(['payment_status' => 'pending']);
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
                    Log::warning('Unknown transaction status from Midtrans', [
                        'order_id' => $orderId,
                        'status' => $transactionStatus
                    ]);
                    break;
            }

            Log::info('Midtrans Notification Processed', [
                'transaction_id' => $transaction->id,
                'old_status' => $transaction->getOriginal('payment_status'),
                'new_status' => $transaction->payment_status
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to handle Midtrans notification', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return false;
        }
    }

    public function getTransactionStatus($orderId)
    {
        try {
            $status = \Midtrans\Transaction::status($orderId);

            Log::info('Midtrans Transaction Status Retrieved', [
                'order_id' => $orderId,
                'status' => $status
            ]);

            return $status;
        } catch (\Exception $e) {
            Log::error('Failed to get Midtrans transaction status', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    public function cancelTransaction($orderId)
    {
        try {
            $result = \Midtrans\Transaction::cancel($orderId);

            Log::info('Midtrans Transaction Cancelled', [
                'order_id' => $orderId,
                'result' => $result
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Failed to cancel Midtrans transaction', [
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    public function isSignatureValid($orderId, $statusCode, $grossAmount, $signatureKey)
    {
        $serverKey = config('services.midtrans.server_key');
        $hash = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        return hash_equals($hash, $signatureKey);
    }

    public function createQrisPayment(Transaction $transaction)
    {
        try {
            $payload = [
                'payment_type' => 'qris',
                'transaction_details' => [
                    'order_id' => $transaction->midtrans_order_id ?: $transaction->transaction_code,
                    'gross_amount' => (int) $transaction->total_amount,
                ],
                'qris' => [
                    'acquirer' => 'gopay', // or other QRIS acquirer
                ],
                'customer_details' => [
                    'first_name' => $transaction->user->name,
                    'email' => $transaction->user->email,
                    'phone' => $transaction->user->phone,
                ],
                'item_details' => $transaction->items->map(function ($item) {
                    return [
                        'id' => $item->item_id,
                        'price' => (int) $item->price,
                        'quantity' => $item->quantity,
                        'name' => $item->item_title,
                        'category' => $item->item_type,
                    ];
                })->toArray(),
                'custom_expiry' => [
                    'expiry_duration' => 15,
                    'unit' => 'minute',
                ],
            ];

            Log::info('Creating QRIS Payment', [
                'transaction_id' => $transaction->id,
                'payload' => $payload
            ]);

            $response = \Midtrans\CoreApi::charge($payload);

            Log::info('QRIS Payment Created', [
                'transaction_id' => $transaction->id,
                'response' => $response
            ]);

            return $response;
        } catch (\Exception $e) {
            Log::error('Failed to create QRIS payment', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
