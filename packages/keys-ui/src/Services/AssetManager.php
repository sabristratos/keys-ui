<?php

namespace Keys\UI\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\HtmlString;

class AssetManager
{
    /**
     * Render JavaScript assets with translations
     */
    public function renderScripts(): HtmlString
    {
        $jsPath = 'vendor/keys-ui/keys-ui.min.js';

        // Check if assets are published
        if (!File::exists(public_path($jsPath))) {
            return new HtmlString('<!-- Keys UI JavaScript not found. Run: php artisan vendor:publish --tag=keys-ui-assets -->');
        }

        // Add version hash for cache busting in production
        $url = asset($jsPath);
        if (!app()->hasDebugModeEnabled()) {
            $hash = substr(md5_file(public_path($jsPath)), 0, 8);
            $url .= '?v=' . $hash;
        }

        // Prepare translations
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

        $config = [
            'environment' => app()->environment(),
            'debug' => config('app.debug', false),
            'version' => config('keys-ui.version', '1.2.0'),
        ];

        // Build the complete script output
        $html = '<script>';
        $html .= 'window.KeysUITranslations = ' . json_encode($translations, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) . ';';
        $html .= 'window.KeysUIConfig = ' . json_encode($config, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) . ';';
        $html .= '</script>' . "\n";
        $html .= '<script src="' . $url . '" defer></script>' . "\n";
        $html .= '<script defer>' . "\n";
        $html .= 'document.addEventListener("DOMContentLoaded", function() {' . "\n";
        $html .= '  if (typeof KeysUI !== "undefined" && KeysUI.init) {' . "\n";
        $html .= '    KeysUI.init();' . "\n";
        $html .= '  }' . "\n";
        $html .= '});' . "\n";
        $html .= '</script>';

        return new HtmlString($html);
    }
}