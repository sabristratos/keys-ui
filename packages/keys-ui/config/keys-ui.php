<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Keys UI Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration options for the Keys UI package.
    | You can customize component behavior by modifying the values below.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Asset Management
    |--------------------------------------------------------------------------
    |
    | These options control how Keys UI assets are injected and managed
    | in your application layouts and views.
    |
    */

    'assets' => [

        /*
        | Auto-inject assets into layouts
        | When enabled, Keys UI will automatically inject its CSS and JS assets
        | into your layouts using Blade directives.
        */
        'auto_inject' => env('KEYS_UI_AUTO_INJECT', true),

        /*
        | Development mode detection
        | When true, the package will check if Vite dev server is running
        | and use hot module replacement for faster development.
        */
        'development_mode' => env('KEYS_UI_DEV_MODE', app()->hasDebugModeEnabled()),

        /*
        | Asset versioning
        | Controls whether to append version hashes to asset URLs
        | for cache busting in production.
        */
        'versioning' => env('KEYS_UI_VERSIONING', !app()->hasDebugModeEnabled()),

        /*
        | Asset paths configuration
        | Customize where Keys UI looks for and publishes its assets.
        */
        'paths' => [
            'css' => 'css/keys-ui.css',
            'js' => 'js/keys-ui.js',
            'public_path' => 'vendor/keys-ui',
        ],

        /*
        | Vite configuration
        | Settings for integration with Vite build system.
        */
        'vite' => [
            'dev_server_url' => env('VITE_DEV_SERVER_URL', 'http://localhost:5173'),
            'manifest_path' => 'build/manifest.json',
            'hot_file' => 'build/hot',
        ],

        /*
        | Build settings
        | Configuration for the asset build pipeline.
        */
        'build' => [
            'output_dir' => 'build',
            'watch_mode' => env('KEYS_UI_WATCH', false),
            'minify' => env('KEYS_UI_MINIFY', !app()->hasDebugModeEnabled()),
        ],

    ],

];