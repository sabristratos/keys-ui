<?php

namespace Keys\UI\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\HtmlString;

class AssetManager
{
    protected array $config;

    public function __construct()
    {
        $this->config = config('keys-ui.assets', []);
    }

    /**
     * Render JavaScript assets and translations only
     * CSS should be imported via @import in your app.css file
     */
    public function renderAssets(): HtmlString
    {
        return new HtmlString(
            $this->renderTranslations()->toHtml() . "\n" .
            $this->renderScripts()->toHtml()
        );
    }

    /**
     * @deprecated CSS should be imported via @import in your app.css file
     */
    public function renderStyles(): HtmlString
    {
        return new HtmlString('');
    }

    /**
     * Render JS assets
     */
    public function renderScripts(): HtmlString
    {
        if (!$this->shouldInjectAssets()) {
            return new HtmlString('');
        }

        $html = '';

        if ($this->isDevelopmentMode() && $this->isViteDevServerRunning()) {
            $html .= $this->renderViteDevScripts();
        } else {
            $html .= $this->renderProductionScripts();
        }

        return new HtmlString($html);
    }

    /**
     * Render translations for JavaScript
     */
    public function renderTranslations(): HtmlString
    {
        $translations = [
            'feedback' => [
                'copied_clipboard' => __('keys-ui::keys-ui.feedback.copied_clipboard'),
                'copy_failed' => __('keys-ui::keys-ui.feedback.copy_failed'),
            ],
            'aria' => [
                'show_password' => __('keys-ui::keys-ui.aria.show_password'),
                'hide_password' => __('keys-ui::keys-ui.aria.hide_password'),
            ],
        ];

        $html = '<script>';
        $html .= 'window.KeysUITranslations = ' . json_encode($translations, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) . ';';
        $html .= '</script>';

        return new HtmlString($html);
    }

    /**
     * Check if assets should be injected
     */
    protected function shouldInjectAssets(): bool
    {
        return $this->config['auto_inject'] ?? true;
    }

    /**
     * Check if we're in development mode
     */
    protected function isDevelopmentMode(): bool
    {
        return $this->config['development_mode'] ?? app()->hasDebugModeEnabled();
    }

    /**
     * Check if Vite dev server is running
     */
    protected function isViteDevServerRunning(): bool
    {
        // Always use production assets from published location
        // This ensures zero-config setup works consistently
        return false;
    }


    /**
     * @deprecated Development mode is not used in zero-config setup
     */
    protected function renderViteDevScripts(): string
    {
        return $this->renderProductionScripts();
    }


    /**
     * Render production JavaScript
     */
    protected function renderProductionScripts(): string
    {
        // Always use the published UMD build for zero-config setup
        $jsPath = 'vendor/keys-ui/keys-ui.umd.js';

        // Check if assets are published
        if (!File::exists(public_path($jsPath))) {
            return '<!-- Keys UI JavaScript not found. Run: php artisan vendor:publish --tag=keys-ui-assets -->';
        }

        $url = $this->shouldUseVersioning() ? $this->addVersionHash($jsPath) : $jsPath;
        $html = '<script src="' . asset($url) . '" defer></script>' . "\n";
        $html .= '<script defer>' . "\n";
        $html .= 'document.addEventListener("DOMContentLoaded", function() {' . "\n";
        $html .= '  if (typeof KeysUI !== "undefined" && KeysUI.init) {' . "\n";
        $html .= '    KeysUI.init();' . "\n";
        $html .= '  }' . "\n";
        $html .= '});' . "\n";
        $html .= '</script>';
        return $html;
    }


    /**
     * Get JavaScript asset path
     */
    protected function getAssetPath(string $type): ?string
    {
        // For zero-config, always use the published location
        if ($type !== 'js') {
            return null;
        }

        $jsPath = 'vendor/keys-ui/keys-ui.umd.js';
        return File::exists(public_path($jsPath)) ? $jsPath : null;
    }

    /**
     * Check if versioning should be used
     */
    protected function shouldUseVersioning(): bool
    {
        return $this->config['versioning'] ?? !app()->hasDebugModeEnabled();
    }

    /**
     * Add version hash to asset path
     */
    protected function addVersionHash(string $path): string
    {
        $fullPath = public_path($path);

        if (!File::exists($fullPath)) {
            return $path;
        }

        $hash = substr(md5_file($fullPath), 0, 8);

        return $path . '?v=' . $hash;
    }
}