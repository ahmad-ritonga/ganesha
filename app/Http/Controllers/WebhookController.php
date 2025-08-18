<?php

namespace App\Http\Controllers;

use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    public function midtrans(Request $request)
    {
        try {
            Log::info('Midtrans webhook received', [
                'headers' => $request->headers->all(),
                'body' => $request->all()
            ]);

            // Handle the notification
            $result = $this->midtransService->handleNotification();

            if ($result) {
                Log::info('Midtrans webhook processed successfully');
                return response()->json(['status' => 'success']);
            } else {
                Log::error('Midtrans webhook processing failed');
                return response()->json(['status' => 'error'], 400);
            }
        } catch (\Exception $e) {
            Log::error('Midtrans webhook error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['status' => 'error'], 500);
        }
    }
}
