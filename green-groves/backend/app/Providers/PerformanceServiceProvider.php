<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PerformanceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Enable query logging for slow queries
        if (Config::get('performance.database.slow_query_log')) {
            DB::listen(function ($query) {
                $slowQueryTime = Config::get('performance.database.slow_query_time', 2);
                
                if ($query->time > $slowQueryTime * 1000) {
                    Log::warning('Slow Query Detected', [
                        'sql' => $query->sql,
                        'bindings' => $query->bindings,
                        'time' => $query->time . 'ms',
                        'connection' => $query->connectionName,
                    ]);
                }
            });
        }

        // Configure cache settings
        $this->configureCache();

        // Configure database settings
        $this->configureDatabase();
    }

    /**
     * Configure cache settings
     */
    private function configureCache(): void
    {
        // Set default cache TTL
        $defaultTtl = Config::get('performance.cache.default_ttl', 300);
        
        // Configure cache tags
        Cache::macro('rememberWithTags', function ($key, $tags, $ttl, $callback) {
            return Cache::tags($tags)->remember($key, $ttl, $callback);
        });
    }

    /**
     * Configure database settings
     */
    private function configureDatabase(): void
    {
        // Set connection timeout
        $connectionTimeout = Config::get('performance.database.connection_timeout', 30);
        $queryTimeout = Config::get('performance.database.query_timeout', 60);

        // Configure database connection
        Config::set('database.connections.mysql.options', [
            \PDO::ATTR_TIMEOUT => $connectionTimeout,
            \PDO::MYSQL_ATTR_INIT_COMMAND => "SET SESSION wait_timeout = {$queryTimeout}",
        ]);
    }
}
