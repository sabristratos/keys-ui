<?php

namespace Keys\UI;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Keys\UI\Services\KeysManager;
use Keys\UI\Services\ModalManager;
use Keys\UI\Services\ToastManager;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

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

        $this->app->singleton(ModalManager::class, function ($app) {
            return new ModalManager;
        });

        $this->app->singleton(ToastManager::class, function ($app) {
            return new ToastManager;
        });

        $this->app->singleton(KeysManager::class, function ($app) {
            return new KeysManager;
        });
    }

    /**
     * Bootstrap any package services.
     */
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'keys');
        $this->loadTranslationsFrom(__DIR__.'/../lang', 'keys-ui');

        $this->publishes([
            __DIR__.'/../config/keys-ui.php' => config_path('keys-ui.php'),
        ], 'keys-ui-config');

        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/keys'),
        ], 'keys-ui-views');

        $this->publishes([
            __DIR__.'/Components' => app_path('View/Components/Keys'),
            __DIR__.'/../resources/views/components' => resource_path('views/components/keys'),
        ], 'keys-ui-components');

        $this->publishes([
            __DIR__.'/../lang' => $this->app->langPath('vendor/keys-ui'),
        ], 'keys-ui-lang');

        $this->publishes([
            __DIR__.'/../resources/views/layouts' => resource_path('views/components/layouts'),
        ], 'keys-ui-layouts');

        $this->publishes([
            __DIR__.'/../dist/keys-ui.umd.js' => public_path('vendor/keys-ui/keys-ui.js'),
            __DIR__.'/../dist/keys-ui.umd.js' => public_path('vendor/keys-ui/keys-ui.min.js'),
            __DIR__.'/../dist/keys-ui.es.js' => public_path('vendor/keys-ui/keys-ui.es.js'),
            __DIR__.'/../dist/style.css' => public_path('vendor/keys-ui/keys-ui.css'),
        ], 'keys-ui-assets');

        // Auto-discover and register all Blade components
        $this->registerComponents();

        Blade::anonymousComponentPath(__DIR__.'/../resources/views/layouts', 'keys-layouts');

        $this->app->alias(KeysManager::class, 'keys');
    }

    /**
     * Auto-discover and register all Blade components from the Components directory.
     */
    protected function registerComponents(): void
    {
        $componentsPath = __DIR__.'/Components';
        $baseNamespace = 'Keys\\UI\\Components\\';

        if (!is_dir($componentsPath)) {
            return;
        }

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($componentsPath, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $file) {
            if (!$file->isFile() || $file->getExtension() !== 'php') {
                continue;
            }

            // Get relative path from Components directory
            $relativePath = str_replace($componentsPath.DIRECTORY_SEPARATOR, '', $file->getPathname());
            $relativePath = str_replace('.php', '', $relativePath);
            $relativePath = str_replace(DIRECTORY_SEPARATOR, '\\', $relativePath);

            // Build full class name
            $className = $baseNamespace.$relativePath;

            // Convert to component name (kebab-case with dots for nesting)
            $componentName = $this->convertToComponentName($relativePath);

            // Register with Blade
            if (class_exists($className)) {
                Blade::component('keys::'.$componentName, $className);
            }
        }
    }

    /**
     * Convert a class path to a kebab-case component name.
     * Examples:
     *   Button -> button
     *   Button\Group -> button.group
     *   Dropdown\Menu -> dropdown.menu
     *   ColorPicker -> color-picker
     */
    protected function convertToComponentName(string $classPath): string
    {
        // Split by namespace separator
        $parts = explode('\\', $classPath);

        // Convert each part to kebab-case
        $parts = array_map(function ($part) {
            return $this->toKebabCase($part);
        }, $parts);

        // Join with dots for nested components
        return implode('.', $parts);
    }

    /**
     * Convert a string from PascalCase to kebab-case.
     */
    protected function toKebabCase(string $string): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '-$0', $string));
    }
}
