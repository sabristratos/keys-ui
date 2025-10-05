
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
            'select_date' => __('keys-ui::keys-ui.aria.select_date'),
            'select_time' => __('keys-ui::keys-ui.aria.select_time'),
            'clear_date' => __('keys-ui::keys-ui.aria.clear_date'),
            'clear_date_range' => __('keys-ui::keys-ui.aria.clear_date_range'),
            'previous_month' => __('keys-ui::keys-ui.aria.previous_month'),
            'next_month' => __('keys-ui::keys-ui.aria.next_month'),
        ],
        'datepicker' => [
            'placeholder' => __('keys-ui::keys-ui.datepicker.placeholder'),
            'quick_select_label' => __('keys-ui::keys-ui.datepicker.quick_select_label'),
            'clear' => __('keys-ui::keys-ui.datepicker.clear'),
            'clear_range' => __('keys-ui::keys-ui.datepicker.clear_range'),
            'go_to_today' => __('keys-ui::keys-ui.datepicker.go_to_today'),
            'today' => __('keys-ui::keys-ui.datepicker.today'),
            'yesterday' => __('keys-ui::keys-ui.datepicker.yesterday'),
            'last_7_days' => __('keys-ui::keys-ui.datepicker.last_7_days'),
            'last_30_days' => __('keys-ui::keys-ui.datepicker.last_30_days'),
            'this_month' => __('keys-ui::keys-ui.datepicker.this_month'),
            'last_month' => __('keys-ui::keys-ui.datepicker.last_month'),
            'this_year' => __('keys-ui::keys-ui.datepicker.this_year'),
        ],
        'timepicker' => [
            'placeholder' => __('keys-ui::keys-ui.timepicker.placeholder'),
            'time_format' => __('keys-ui::keys-ui.timepicker.time_format'),
            'format_12h' => __('keys-ui::keys-ui.timepicker.format_12h'),
            'format_24h' => __('keys-ui::keys-ui.timepicker.format_24h'),
            'quick_select' => __('keys-ui::keys-ui.timepicker.quick_select'),
            'hour' => __('keys-ui::keys-ui.timepicker.hour'),
            'hours' => __('keys-ui::keys-ui.timepicker.hours'),
            'minutes' => __('keys-ui::keys-ui.timepicker.minutes'),
            'seconds' => __('keys-ui::keys-ui.timepicker.seconds'),
            'period' => __('keys-ui::keys-ui.timepicker.period'),
            'now' => __('keys-ui::keys-ui.timepicker.now'),
            'cancel' => __('keys-ui::keys-ui.timepicker.cancel'),
            'apply' => __('keys-ui::keys-ui.timepicker.apply'),
            'morning' => __('keys-ui::keys-ui.timepicker.morning'),
            'noon' => __('keys-ui::keys-ui.timepicker.noon'),
            'afternoon' => __('keys-ui::keys-ui.timepicker.afternoon'),
            'evening' => __('keys-ui::keys-ui.timepicker.evening'),
        ],
        'calendar' => [
            'previous_month' => __('keys-ui::keys-ui.calendar.previous_month'),
            'next_month' => __('keys-ui::keys-ui.calendar.next_month'),
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