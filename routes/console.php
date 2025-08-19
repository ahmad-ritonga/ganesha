<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule automatic transaction sync every 30 minutes
Schedule::command('transactions:sync-pending --days=3 --batch=100')
    ->everyThirtyMinutes()
    ->withoutOverlapping()
    ->runInBackground();
