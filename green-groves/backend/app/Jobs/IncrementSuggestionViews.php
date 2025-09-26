<?php

namespace App\Jobs;

use App\Models\Suggestion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class IncrementSuggestionViews implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $suggestionId;

    /**
     * Create a new job instance.
     */
    public function __construct($suggestionId)
    {
        $this->suggestionId = $suggestionId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $suggestion = Suggestion::find($this->suggestionId);
            
            if ($suggestion) {
                $suggestion->increment('views');
                
                // Clear cache after view increment
                Cache::forget("suggestion_{$this->suggestionId}");
                
                // Also clear list caches that might be affected
                Cache::forget('suggestions_featured');
            }
        } catch (\Exception $e) {
            // Log the error but don't fail the job for non-critical operations
            Log::warning('Failed to increment suggestion views', [
                'suggestion_id' => $this->suggestionId,
                'error' => $e->getMessage()
            ]);
        }
    }
}
