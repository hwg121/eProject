<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Performance Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains performance-related configuration options
    | for the application.
    |
    */

    'cache' => [
        'default_ttl' => env('CACHE_DEFAULT_TTL', 300), // 5 minutes
        'api_ttl' => env('CACHE_API_TTL', 300), // 5 minutes
        'view_ttl' => env('CACHE_VIEW_TTL', 3600), // 1 hour
        'config_ttl' => env('CACHE_CONFIG_TTL', 3600), // 1 hour
        'route_ttl' => env('CACHE_ROUTE_TTL', 3600), // 1 hour
    ],

    'database' => [
        'slow_query_log' => env('DB_SLOW_QUERY_LOG', true),
        'slow_query_time' => env('DB_SLOW_QUERY_TIME', 2), // seconds
        'connection_timeout' => env('DB_CONNECTION_TIMEOUT', 30),
        'query_timeout' => env('DB_QUERY_TIMEOUT', 60),
    ],

    'api' => [
        'rate_limit' => env('API_RATE_LIMIT', 100), // requests per minute
        'response_cache' => env('API_RESPONSE_CACHE', true),
        'compression' => env('API_COMPRESSION', true),
        'pagination_limit' => env('API_PAGINATION_LIMIT', 50),
    ],

    'frontend' => [
        'lazy_loading' => env('FRONTEND_LAZY_LOADING', true),
        'image_optimization' => env('FRONTEND_IMAGE_OPTIMIZATION', true),
        'code_splitting' => env('FRONTEND_CODE_SPLITTING', true),
        'service_worker' => env('FRONTEND_SERVICE_WORKER', true),
    ],

    'optimization' => [
        'enable_opcache' => env('OPTIMIZATION_OPCACHE', true),
        'enable_redis' => env('OPTIMIZATION_REDIS', true),
        'enable_compression' => env('OPTIMIZATION_COMPRESSION', true),
        'enable_minification' => env('OPTIMIZATION_MINIFICATION', true),
    ],
];
