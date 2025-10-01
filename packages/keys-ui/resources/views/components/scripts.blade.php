
@php

    $jsPath = 'vendor/keys-ui/keys-ui.min.js';
    $jsExists = file_exists(public_path($jsPath));
    $jsUrl = $jsExists ? asset($jsPath) : '';

    if (!app()->hasDebugModeEnabled() && $jsExists) {
        $hash = substr(md5_file(public_path($jsPath)), 0, 8);
        $jsUrl .= '?v=' . $hash;
    }

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
        'version' => '1.2.0',
    ];
@endphp

@if($jsExists)
    
    <script>
        window.KeysUITranslations = @json($translations);
        window.KeysUIConfig = @json($config);
    </script>

    
    <script src="{{ $jsUrl }}" defer></script>

    
    <script defer>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof KeysUI !== 'undefined' && KeysUI.init) {
                KeysUI.init();
            }
        });
    </script>
@else
    
    
    <script>
        console.warn('Keys UI: JavaScript assets not found. Run "composer install" or "composer update" to ensure assets are available.');
    </script>
@endif