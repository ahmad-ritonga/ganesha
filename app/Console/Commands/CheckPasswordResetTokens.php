<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CheckPasswordResetTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:password-reset-tokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check existing password reset tokens';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("🔍 Checking password reset tokens...");
        $this->line("=====================================");

        $tokens = DB::table('password_reset_tokens')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($tokens->isEmpty()) {
            $this->info("✅ No password reset tokens found");
            return Command::SUCCESS;
        }

        $this->info("📋 Found " . $tokens->count() . " password reset tokens:");
        $this->line("");

        foreach ($tokens as $token) {
            $createdAt = Carbon::parse($token->created_at);
            $minutesAgo = $createdAt->diffInMinutes(now());
            $expireMinutes = config('auth.passwords.users.expire', 60);

            $status = $minutesAgo > $expireMinutes ? '❌ EXPIRED' : '✅ VALID';

            $this->line("📧 Email: {$token->email}");
            $this->line("🕒 Created: {$createdAt->format('Y-m-d H:i:s')} ({$minutesAgo} minutes ago)");
            $this->line("⏳ Status: {$status}");
            $this->line("🔑 Token: " . substr($token->token, 0, 20) . "...");
            $this->line("---");
        }

        $expiredCount = $tokens->filter(function ($token) {
            $minutesAgo = Carbon::parse($token->created_at)->diffInMinutes(now());
            return $minutesAgo > config('auth.passwords.users.expire', 60);
        })->count();

        if ($expiredCount > 0) {
            $this->line("");
            $this->warn("⚠️  Found {$expiredCount} expired tokens");
            $this->info("💡 You can clear them with: php artisan clear:password-reset-throttle");
        }

        return Command::SUCCESS;
    }
}
