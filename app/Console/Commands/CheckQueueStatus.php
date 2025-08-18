<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckQueueStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:queue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check queue jobs status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("📋 Queue Status Check:");
        $this->line("======================");

        try {
            // Check pending jobs
            $pendingJobs = DB::table('jobs')->count();
            $this->info("📤 Pending jobs: " . $pendingJobs);

            // Check failed jobs
            $failedJobs = DB::table('failed_jobs')->count();
            $this->info("❌ Failed jobs: " . $failedJobs);

            if ($pendingJobs > 0) {
                $this->line("");
                $this->info("📋 Recent pending jobs:");
                $jobs = DB::table('jobs')->orderBy('created_at', 'desc')->limit(5)->get();
                foreach ($jobs as $job) {
                    $payload = json_decode($job->payload, true);
                    $className = $payload['displayName'] ?? 'Unknown';
                    $this->line("- {$className} (Created: {$job->created_at})");
                }
            }

            if ($failedJobs > 0) {
                $this->line("");
                $this->error("⚠️  There are failed jobs. Check them with:");
                $this->line("php artisan queue:failed");

                $failed = DB::table('failed_jobs')->orderBy('failed_at', 'desc')->limit(3)->get();
                foreach ($failed as $job) {
                    $this->line("- Failed at: {$job->failed_at}");
                    $this->line("  Exception: " . substr($job->exception, 0, 100) . "...");
                }
            }
        } catch (\Exception $e) {
            $this->error("Error checking queue: " . $e->getMessage());
        }

        $this->line("");
        $this->info("💡 Helpful commands:");
        $this->line("- Start queue worker: php artisan queue:work");
        $this->line("- Process specific job: php artisan queue:work --once");
        $this->line("- Clear failed jobs: php artisan queue:flush");

        return Command::SUCCESS;
    }
}
