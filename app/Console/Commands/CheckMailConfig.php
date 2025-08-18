<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;

class CheckMailConfig extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:mail-config';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check current mail configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("🔧 Current Mail Configuration:");
        $this->line("================================");

        $this->info("MAIL_MAILER: " . Config::get('mail.default'));
        $this->info("MAIL_HOST: " . Config::get('mail.mailers.smtp.host'));
        $this->info("MAIL_PORT: " . Config::get('mail.mailers.smtp.port'));
        $this->info("MAIL_USERNAME: " . Config::get('mail.mailers.smtp.username'));
        $this->info("MAIL_ENCRYPTION: " . Config::get('mail.mailers.smtp.encryption'));
        $this->info("MAIL_FROM_ADDRESS: " . Config::get('mail.from.address'));
        $this->info("MAIL_FROM_NAME: " . Config::get('mail.from.name'));

        $this->line("================================");

        // Check if queue is being used
        $this->info("QUEUE_CONNECTION: " . Config::get('queue.default'));

        // Check if password reset config
        $this->info("Password reset expire time: " . Config::get('auth.passwords.users.expire') . " minutes");

        return Command::SUCCESS;
    }
}
