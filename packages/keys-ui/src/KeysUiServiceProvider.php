<?php

namespace Keys\UI;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Keys\UI\Components\Icon;

class KeysUiServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/keys-ui.php',
            'keys-ui'
        );
    }

    /**
     * Bootstrap any package services.
     */
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'keys');

        $this->publishes([
            __DIR__.'/../config/keys-ui.php' => config_path('keys-ui.php'),
        ], 'keys-ui-config');

        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/keys'),
        ], 'keys-ui-views');

        $this->publishes([
            __DIR__.'/../resources/css' => public_path('vendor/keys-ui'),
        ], 'keys-ui-assets');

        $this->publishes([
            __DIR__.'/Components' => app_path('View/Components/Keys'),
            __DIR__.'/../resources/views/components' => resource_path('views/components/keys'),
        ], 'keys-ui-components');

        Blade::component('keys::icon', Icon::class);
    }
}