<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Article;
use App\Models\Video;

class PopulatePublishedAt extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'published:populate {--dry-run : Run without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate published_at column for existing published records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        
        if ($isDryRun) {
            $this->warn('🔍 DRY RUN MODE - No changes will be made');
        } else {
            $this->info('🚀 Starting published_at population...');
        }

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
        $total = $articlesCount + $videosCount;
        
        if ($isDryRun) {
            $this->warn("📊 SUMMARY (DRY RUN): Would update {$total} records");
            $this->info('   Run without --dry-run flag to apply changes');
        } else {
            $this->success("✨ SUCCESS: Updated {$total} records total");
        }
        
        $this->newLine();
        $this->comment('💡 TIP: New records with status=published will auto-set published_at');
        
        return 0;
    }

    /**
     * Populate published_at for a specific table
     */
    private function populateTable(string $table, bool $isDryRun): int
    {
        // Count records that need updating
        // Only update records with status='published' and NULL published_at
        $count = DB::table($table)
            ->where('status', 'published')
            ->whereNull('published_at')
            ->count();
        
        if ($count === 0) {
            $this->comment("   ℹ️  No records to update in {$table}");
            return 0;
        }
        
        $this->comment("   Found {$count} published records with NULL published_at");
        
        if (!$isDryRun) {
            // Set published_at = created_at for published records
            $affected = DB::table($table)
                ->where('status', 'published')
                ->whereNull('published_at')
                ->update([
                    'published_at' => DB::raw('created_at')
                ]);
            
            $this->comment("   Set published_at = created_at for {$affected} records");
            
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


