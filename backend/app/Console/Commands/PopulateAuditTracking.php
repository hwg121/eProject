<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Article;
use App\Models\Video;

class PopulateAuditTracking extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'audit:populate {--dry-run : Run without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate created_by and updated_by columns for existing records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        
        if ($isDryRun) {
            $this->warn('🔍 DRY RUN MODE - No changes will be made');
        } else {
            $this->info('🚀 Starting audit tracking population...');
        }

        $this->newLine();
        
        // Products
        $this->info('📦 Processing Products...');
        $productsCount = $this->populateTable('products', $isDryRun);
        $this->info("   ✅ Updated {$productsCount} products");
        
        $this->newLine();
        
        // Articles
        $this->info('📰 Processing Articles...');
        $articlesCount = $this->populateTable('articles', $isDryRun);
        $this->info("   ✅ Updated {$articlesCount} articles");
        
        $this->newLine();
        
        // Videos
        $this->info('🎥 Processing Videos...');
        $videosCount = $this->populateTable('videos', $isDryRun);
        $this->info("   ✅ Updated {$videosCount} videos");
        
        $this->newLine();
        
        // Summary
        $total = $productsCount + $articlesCount + $videosCount;
        
        if ($isDryRun) {
            $this->warn("📊 SUMMARY (DRY RUN): Would update {$total} records");
            $this->info('   Run without --dry-run flag to apply changes');
        } else {
            $this->success("✨ SUCCESS: Updated {$total} records total");
        }
        
        return 0;
    }

    /**
     * Populate audit tracking for a specific table
     */
    private function populateTable(string $table, bool $isDryRun): int
    {
        // Count records that need updating
        $count = DB::table($table)
            ->whereNull('created_by')
            ->whereNotNull('author_id')
            ->count();
        
        if ($count === 0) {
            $this->comment("   ℹ️  No records to update in {$table}");
            return 0;
        }
        
        $this->comment("   Found {$count} records with NULL created_by");
        
        if (!$isDryRun) {
            // Perform the update
            $affected = DB::table($table)
                ->whereNull('created_by')
                ->whereNotNull('author_id')
                ->update([
                    'created_by' => DB::raw('author_id'),
                    'updated_by' => DB::raw('author_id'),
                    'updated_at' => DB::raw('updated_at') // Keep original updated_at
                ]);
            
            return $affected;
        }
        
        return $count;
    }

    /**
     * Display success message in green
     */
    private function success(string $message): void
    {
        $this->info($message);
    }
}



