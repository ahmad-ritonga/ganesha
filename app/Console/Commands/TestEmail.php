<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    protected $signature = 'test:email {email}';
    protected $description = 'Test email configuration';

    public function handle()
    {
        $email = $this->argument('email');

        try {
            Mail::raw('Test email from Ganesha Laravel App', function ($message) use ($email) {
                $message->to($email)
                    ->subject('Test Email - Ganesha');
            });

            $this->info('Email sent successfully!');
        } catch (Exception $e) {
            $this->error('Email failed: ' . $e->getMessage());
        }
    }
}
