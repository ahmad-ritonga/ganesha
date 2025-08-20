<?php
// app/Console/Commands/ExportDatabase.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ExportDatabase extends Command
{
    protected $signature = 'db:export {filename=ganesha_complete.sql}';
    protected $description = 'Export database to SQL file';

    public function handle()
    {
        $filename = $this->argument('filename');

        $this->info("🗄️ Exporting database to {$filename}...");

        $output = [];
        $output[] = "-- Ganesha Database Export";
        $output[] = "-- Generated: " . now();
        $output[] = "";
        $output[] = "SET FOREIGN_KEY_CHECKS=0;";
        $output[] = "";

        // Get all tables
        $tables = DB::select('SHOW TABLES');
        $tableKey = 'Tables_in_' . config('database.connections.mysql.database');

        foreach ($tables as $table) {
            $tableName = $table->$tableKey;

            $this->line("📋 Exporting: {$tableName}");

            // Table structure
            $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`")[0];
            $output[] = "-- Table: {$tableName}";
            $output[] = "DROP TABLE IF EXISTS `{$tableName}`;";
            $output[] = $createTable->{'Create Table'} . ";";
            $output[] = "";

            // Table data
            $rows = DB::table($tableName)->get();

            if ($rows->count() > 0) {
                $output[] = "-- Data for {$tableName}";

                foreach ($rows as $row) {
                    $values = [];
                    foreach ($row as $value) {
                        $values[] = $value === null ? 'NULL' : "'" . addslashes($value) . "'";
                    }

                    $columns = implode('`, `', array_keys((array)$row));
                    $valuesStr = implode(', ', $values);

                    $output[] = "INSERT INTO `{$tableName}` (`{$columns}`) VALUES ({$valuesStr});";
                }
                $output[] = "";
            }
        }

        $output[] = "SET FOREIGN_KEY_CHECKS=1;";

        // Write file
        file_put_contents($filename, implode("\n", $output));

        $size = round(filesize($filename) / 1024, 2);
        $this->info("✅ Export completed!");
        $this->line("📁 File: {$filename} ({$size} KB)");

        return 0;
    }
}
