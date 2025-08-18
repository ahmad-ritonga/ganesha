<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Password;
use Exception;

class DebugResetEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:reset-email {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Debug reset password email sending';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        $this->info("🔍 Debugging reset password email for: {$email}");

        // Check if user exists
        $user = User::where('email', $email)->first();
        if (!$user) {
            $this->error("❌ User not found with email: {$email}");
            return Command::FAILURE;
        }

        $this->info("✅ User found: {$user->name}");

        try {
            // Test sending reset link
            $this->info("📧 Attempting to send reset password email...");

            $status = Password::sendResetLink(['email' => $email]);

            $this->info("📤 Password reset status: " . $status);

            if ($status === Password::RESET_LINK_SENT) {
                $this->info("✅ Reset password email sent successfully!");
                $this->info("📬 Check the inbox for: {$email}");
            } else {
                $this->error("❌ Failed to send reset email. Status: " . $status);
            }
        } catch (Exception $e) {
            $this->error('❌ Exception occurred: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());

            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}
