<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ClearPasswordResetThrottle extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clear:password-reset-throttle {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear password reset throttle for testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        $this->info("🧹 Clearing password reset throttle...");

        if ($email) {
            // Clear specific email throttle
            $deleted = DB::table('password_reset_tokens')
                ->where('email', $email)
                ->delete();

            $this->info("✅ Cleared password reset tokens for: {$email} ({$deleted} tokens removed)");
        } else {
            // Clear all throttle
            $deleted = DB::table('password_reset_tokens')->delete();
            $this->info("✅ Cleared all password reset tokens ({$deleted} tokens removed)");
        }

        // Clear rate limiter cache
        $this->call('cache:clear');

        $this->info("🚀 You can now test password reset again!");

        return Command::SUCCESS;
    }
}
