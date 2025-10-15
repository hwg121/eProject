<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'metric_name',
        'goal_value',
        'baseline_value',
        'baseline_captured_at',
    ];

    protected $casts = [
        'goal_value' => 'decimal:2',
        'baseline_value' => 'decimal:2',
        'baseline_captured_at' => 'datetime',
    ];

    /**
     * Get campaign setting by metric name
     */
    public static function getByMetric(string $metricName): ?self
    {
        return self::where('metric_name', $metricName)->first();
    }

    /**
     * Check if baseline should be reset based on 30% threshold
     */
    public function shouldResetBaseline(float $newGoal): bool
    {
        $oldGoal = (float) $this->goal_value;
        
        // Prevent division by zero
        if ($oldGoal == 0) {
            return true; // Reset if old goal was 0
        }

        $changePercentage = abs($newGoal - $oldGoal) / $oldGoal;
        
        return $changePercentage >= 0.3; // 30% threshold
    }

    /**
     * Get all metric names
     */
    public static function getMetricNames(): array
    {
        return ['visitors', 'views', 'content', 'products', 'rating'];
    }
}

