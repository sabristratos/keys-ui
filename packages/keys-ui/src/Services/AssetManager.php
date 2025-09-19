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
     * Render both CSS and JS assets
     */
    public function renderAssets(): HtmlString
    {
        return new HtmlString(
            $this->renderStyles()->toHtml() . "\n" .
            $this->renderTranslations()->toHtml() . "\n" .
            $this->renderScripts()->toHtml()
        );
    }

    /**
     * Render CSS assets
     */
    public function renderStyles(): HtmlString
    {
        if (!$this->shouldInjectAssets()) {
            return new HtmlString('');
        }

        $html = '';

        if ($this->isDevelopmentMode() && $this->isViteDevServerRunning()) {
            $html .= $this->renderViteDevStyles();
        } else {
            $html .= $this->renderProductionStyles();
        }

        return new HtmlString($html);
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
        $hotFile = public_path($this->config['vite']['hot_file'] ?? 'build/hot');
        return File::exists($hotFile);
    }

    /**
     * Render styles for Vite development mode
     */
    protected function renderViteDevStyles(): string
    {
        $devServerUrl = $this->config['vite']['dev_server_url'] ?? 'http://localhost:5173';
        $html = '<link rel="stylesheet" href="' . $devServerUrl . '/packages/keys-ui/resources/css/keys-ui.css">' . "\n";

        // Also load style.css for Quill styles in development
        $styleCssPath = $this->getSpecificAssetPath('css', 'style.css');
        if ($styleCssPath) {
            $html .= '<link rel="stylesheet" href="' . asset($styleCssPath) . '">';
        }

        return $html;
    }

    /**
     * Render scripts for Vite development mode
     */
    protected function renderViteDevScripts(): string
    {
        $devServerUrl = $this->config['vite']['dev_server_url'] ?? 'http://localhost:5173';
        $html = '<script type="module" src="' . $devServerUrl . '/@vite/client"></script>' . "\n";
        $html .= '<script type="module" src="' . $devServerUrl . '/packages/keys-ui/resources/js/index.ts"></script>' . "\n";
        $html .= '<script type="module">' . "\n";
        $html .= 'import { initializeKeysUI } from "' . $devServerUrl . '/packages/keys-ui/resources/js/index.ts";' . "\n";
        $html .= 'document.addEventListener("DOMContentLoaded", initializeKeysUI);' . "\n";
        $html .= '</script>';
        return $html;
    }

    /**
     * Render styles for production mode
     */
    protected function renderProductionStyles(): string
    {
        $html = '';

        // Load both CSS files - keys-ui.css and style.css (with Quill styles)
        $cssFiles = ['keys-ui.css', 'style.css'];

        foreach ($cssFiles as $cssFile) {
            $cssPath = $this->getSpecificAssetPath('css', $cssFile);
            if ($cssPath) {
                $url = $this->shouldUseVersioning() ? $this->addVersionHash($cssPath) : $cssPath;
                $html .= '<link rel="stylesheet" href="' . asset($url) . '">' . "\n";
            }
        }

        return $html;
    }

    /**
     * Render scripts for production mode
     */
    protected function renderProductionScripts(): string
    {
        $jsPath = $this->getAssetPath('js');
        if (!$jsPath) {
            return '';
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
     * Get specific asset path for a given file
     */
    protected function getSpecificAssetPath(string $type, string $filename): ?string
    {
        $publicPath = $this->config['paths']['public_path'] ?? 'vendor/keys-ui';
        $fullPath = $publicPath . '/' . $filename;

        return File::exists(public_path($fullPath)) ? $fullPath : null;
    }

    /**
     * Get asset path from manifest or fallback to configured path
     */
    protected function getAssetPath(string $type): ?string
    {
        $manifestPath = public_path($this->config['vite']['manifest_path'] ?? 'build/manifest.json');

        if (File::exists($manifestPath)) {
            $manifest = json_decode(File::get($manifestPath), true);
            $entryKey = $type === 'css' ? 'packages/keys-ui/resources/css/keys-ui.css' : 'packages/keys-ui/resources/js/index.ts';

            if (isset($manifest[$entryKey])) {
                return $type === 'css'
                    ? ($manifest[$entryKey]['css'][0] ?? null)
                    : $manifest[$entryKey]['file'];
            }
        }

        $publicPath = $this->config['paths']['public_path'] ?? 'vendor/keys-ui';
        $fileName = $this->config['paths'][$type] ?? ($type === 'css' ? 'style.css' : 'keys-ui.es.js');

        $fullPath = $publicPath . '/' . $fileName;

        return File::exists(public_path($fullPath)) ? $fullPath : null;
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