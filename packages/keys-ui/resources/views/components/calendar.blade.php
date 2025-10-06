@php
    $wireAttributes = $attributes->whereStartsWith('wire:');

    $baseWidth = $monthsToShow > 1 ? 'min-w-[560px] w-full' : 'min-w-[280px] w-max';
    $baseClasses = 'user-select-none text-primary';

    $sizeClasses = match ($size) {
        'sm' => 'text-sm',
        'md' => 'text-sm',
        'lg' => 'text-base',
        default => 'text-sm'
    };

    $stateClasses = '';
    if ($disabled) {
        $stateClasses = 'opacity-60 pointer-events-none';
    } elseif ($hasError()) {
        $stateClasses = 'border-danger';
    } else {
        $stateClasses = 'border-line hover:border-neutral-300 dark:hover:border-neutral-600';
    }

    $cellClasses = match ($size) {
        'sm' => 'w-8 h-8 text-xs',
        'md' => 'w-10 h-10 text-sm',
        'lg' => 'w-12 h-12 text-base',
        default => 'w-10 h-10 text-sm'
    };

    $containerAttributes = $attributes->whereDoesntStartWith('wire:')->merge([
        'class' => trim($baseWidth . ' ' . $baseClasses . ' ' . $sizeClasses . ' ' . $stateClasses),
        'data-keys-calendar-config' => json_encode($computedInitialData),
    ])->merge($dataAttributes);
@endphp

@if($isShorthand())
    <x-keys::field :label="$label" :optional="$optional" :required="$required" :errors="$errors" :showErrors="$showErrors">
        <div {{ $containerAttributes }}>
            <div class="calendar-header flex items-center justify-between px-4 py-3 border-b border-line">
                <x-keys::button
                    variant="ghost"
                    size="sm"
                    data-calendar-nav="prev"
                    :disabled="$disabled"
                    icon-left="heroicon-o-chevron-left"
                >
                    <span class="sr-only">{{ __('keys-ui::keys-ui.calendar.previous_month') }}</span>
                </x-keys::button>

                <div class="calendar-month-year-container relative">
                    <x-keys::button
                        variant="ghost"
                        size="sm"
                        data-calendar-month-year-btn
                        :disabled="$disabled"
                    >
                        <span class="calendar-month-year-display">{{ $monthYearDisplay }}</span>
                    </x-keys::button>
                </div>

                <x-keys::button
                    variant="ghost"
                    size="sm"
                    data-calendar-nav="next"
                    :disabled="$disabled"
                    icon-left="heroicon-o-chevron-right"
                >
                    <span class="sr-only">{{ __('keys-ui::keys-ui.calendar.next_month') }}</span>
                </x-keys::button>
            </div>

            <div class="calendar-main-content flex flex-col md:flex-row gap-4" data-calendar-main-content>

                @if(isset($quickSelectors) && is_array($quickSelectors) && count($quickSelectors) > 0)
                    <div class="calendar-quick-selectors md:w-max flex-shrink-0 order-first p-2" data-view-mode-show="calendar">
                        <div class="text-xs font-medium text-muted mb-2">{{ __('keys-ui::keys-ui.datepicker.quick_select_label') }}</div>
                        <div class="flex flex-wrap md:flex-col gap-1">
                            @foreach($quickSelectors as $selector)
                                <x-keys::button
                                    variant="ghost"
                                    size="xs"
                                    data-quick-selector="{{ $selector['value'] }}"
                                    :title="$selector['description'] ?? $selector['label']"
                                    aria-label="{{ $selector['description'] ?? $selector['label'] }}"
                                >
                                    {{ $selector['label'] }}
                                </x-keys::button>
                            @endforeach
                        </div>
                    </div>
                @endif


                <div class="calendar-grid-wrapper flex-1 py-2" data-calendar-grid-wrapper>
                    @if($monthsToShow > 1)
                        <div class="calendar-multi-month-grid grid gap-8"
                             style="grid-template-columns: repeat({{ min($monthsToShow, 3) }}, 1fr);">
                            @for($i = 0; $i < $monthsToShow; $i++)
                                <div class="calendar-grid" data-calendar-grid-container data-month-index="{{ $i }}">

                                </div>
                            @endfor
                        </div>
                    @else
                        <div class="calendar-grid" data-calendar-grid-container>

                        </div>
                    @endif
                </div>
            </div>

            <div class="calendar-footer flex items-center justify-between px-4 py-3 border-t border-line">
                <div class="flex items-center gap-2">
                    <x-keys::button
                        variant="ghost"
                        color="danger"
                        size="sm"
                        data-calendar-action="clear"
                        :disabled="$disabled"
                        title="Clear selected {{ $isRange ? 'date range' : 'date' }}"
                        icon-left="heroicon-o-trash"
                    >
{{ $isRange ? __('keys-ui::keys-ui.datepicker.clear_range') : __('keys-ui::keys-ui.datepicker.clear') }}
                    </x-keys::button>
                </div>

                <div class="flex items-center gap-2">
                    <x-keys::button
                        variant="ghost"
                        color="primary"
                        size="sm"
                        data-calendar-action="today"
                        :disabled="$disabled"
                        title="Select today's date"
                        icon-left="heroicon-o-map-pin"
                    >
{{ __('keys-ui::keys-ui.datepicker.go_to_today') }}
                    </x-keys::button>
                </div>
            </div>

            @if($name)
                @if($isRange)
                    <input type="hidden"
                           name="{{ $name }}_start"
                           value="{{ $startDate instanceof \Carbon\Carbon ? $startDate->format('Y-m-d') : '' }}"
                           class="calendar-hidden-input calendar-start-input"
                           @if($required) required @endif>
                    <input type="hidden"
                           name="{{ $name }}_end"
                           value="{{ $endDate instanceof \Carbon\Carbon ? $endDate->format('Y-m-d') : '' }}"
                           class="calendar-hidden-input calendar-end-input"
                           @if($required) required @endif
                           {{ $wireAttributes }}>
                    <input type="hidden"
                           name="{{ $name }}"
                           value="{{ $formattedValue }}"
                           class="calendar-hidden-input calendar-range-input">
                @else
                    <input type="hidden"
                           name="{{ $name }}"
                           value="{{ $formattedValue }}"
                           class="calendar-hidden-input"
                           @if($required) required @endif
                           {{ $wireAttributes }}>
                @endif
            @endif
        </div>
    </x-keys::field>
@else
    <div {{ $containerAttributes }}>
        <div class="calendar-header flex items-center justify-between px-4 py-3 border-b border-line">
            <x-keys::button
                variant="ghost"
                size="sm"
                data-calendar-nav="prev"
                :disabled="$disabled"
                icon-left="heroicon-o-chevron-left"
            >
                <span class="sr-only">{{ __('keys-ui::keys-ui.calendar.previous_month') }}</span>
            </x-keys::button>

            <div class="calendar-month-year-container relative">
                <x-keys::button
                    variant="ghost"
                    size="sm"
                    data-calendar-month-year-btn
                    :disabled="$disabled"
                >
                    <span class="calendar-month-year-display">{{ $monthYearDisplay }}</span>
                </x-keys::button>
            </div>

            <x-keys::button
                variant="ghost"
                size="sm"
                data-calendar-nav="next"
                :disabled="$disabled"
                icon-left="heroicon-o-chevron-right"
            >
                <span class="sr-only">{{ __('keys-ui::keys-ui.calendar.next_month') }}</span>
            </x-keys::button>
        </div>

        <div class="calendar-main-content flex flex-col md:flex-row gap-4" data-calendar-main-content>

            @if(isset($quickSelectors) && is_array($quickSelectors) && count($quickSelectors) > 0)
                <div class="calendar-quick-selectors md:w-max flex-shrink-0 order-first p-2" data-view-mode-show="calendar">
                    <div class="text-xs font-medium text-muted mb-2">{{ __('keys-ui::keys-ui.datepicker.quick_select_label') }}</div>
                    <div class="flex flex-wrap md:flex-col gap-1">
                        @foreach($quickSelectors as $selector)
                            <x-keys::button
                                variant="ghost"
                                size="xs"
                                data-quick-selector="{{ $selector['value'] }}"
                                :title="$selector['description'] ?? $selector['label']"
                                aria-label="{{ $selector['description'] ?? $selector['label'] }}"
                            >
                                {{ $selector['label'] }}
                            </x-keys::button>
                        @endforeach
                    </div>
                </div>
            @endif


            <div class="calendar-grid-wrapper flex-1 py-2" data-calendar-grid-wrapper>
                @if($monthsToShow > 1)
                    <div class="calendar-multi-month-grid grid gap-8"
                         style="grid-template-columns: repeat({{ min($monthsToShow, 3) }}, 1fr);">
                        @for($i = 0; $i < $monthsToShow; $i++)
                            <div class="calendar-grid" data-calendar-grid-container data-month-index="{{ $i }}">

                            </div>
                        @endfor
                    </div>
                @else
                    <div class="calendar-grid" data-calendar-grid-container>

                    </div>
                @endif
            </div>
        </div>

        <div class="calendar-footer flex items-center justify-between px-4 py-3 border-t border-line">
            <div class="flex items-center gap-2">
                <x-keys::button
                    variant="ghost"
                    color="danger"
                    size="sm"
                    data-calendar-action="clear"
                    :disabled="$disabled"
                    title="Clear selected {{ $isRange ? 'date range' : 'date' }}"
                    icon-left="heroicon-o-trash"
                >
{{ $isRange ? __('keys-ui::keys-ui.datepicker.clear_range') : __('keys-ui::keys-ui.datepicker.clear') }}
                </x-keys::button>
            </div>

            <div class="flex items-center gap-2">
                <x-keys::button
                    variant="ghost"
                    color="primary"
                    size="sm"
                    data-calendar-action="today"
                    :disabled="$disabled"
                    title="Select today's date"
                    icon-left="heroicon-o-map-pin"
                >
{{ __('keys-ui::keys-ui.datepicker.go_to_today') }}
                </x-keys::button>
            </div>
        </div>

        @if($name)
            @if($isRange)
                <input type="hidden"
                       name="{{ $name }}_start"
                       value="{{ $startDate instanceof \Carbon\Carbon ? $startDate->format('Y-m-d') : '' }}"
                       class="calendar-hidden-input calendar-start-input"
                       @if($required) required @endif>
                <input type="hidden"
                       name="{{ $name }}_end"
                       value="{{ $endDate instanceof \Carbon\Carbon ? $endDate->format('Y-m-d') : '' }}"
                       class="calendar-hidden-input calendar-end-input"
                       @if($required) required @endif
                       {{ $wireAttributes }}>
                <input type="hidden"
                       name="{{ $name }}"
                       value="{{ $formattedValue }}"
                       class="calendar-hidden-input calendar-range-input">
            @else
                <input type="hidden"
                       name="{{ $name }}"
                       value="{{ $formattedValue }}"
                       class="calendar-hidden-input"
                       @if($required) required @endif
                       {{ $wireAttributes }}>
            @endif
        @endif
    </div>
@endif

<style>

    /* === ONLY ESSENTIAL CALENDAR STYLES - Most moved to Tailwind === */
    /* Basic calendar structure - cannot be replaced by utilities */
    [data-keys-calendar="true"] .calendar-day {
        text-align: center;
        position: relative;
    }

    /* Size-dependent styles now handled by Tailwind in JavaScript */

    /* === IMPROVED RANGE SELECTION STYLES === */
    /* In-range dates - subtle background */
    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-in-range="true"] {
        background-color: var(--color-accent-50) !important;
        color: var(--color-accent-700) !important;
        border: 1px solid var(--color-accent-100) !important;
        position: relative;
    }

    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-in-range="true"]:hover {
        background-color: var(--color-accent-100) !important;
        color: var(--color-accent-800) !important;
        border-color: var(--color-accent-200) !important;
    }

    /* Range start date - distinct styling with gradient */
    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-start="true"] {
        background: linear-gradient(135deg, var(--color-accent), var(--color-accent-600)) !important;
        color: white !important;
        font-weight: 700;
        border: 2px solid var(--color-accent-700) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Range end date - distinct styling with different gradient */
    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-end="true"] {
        background: linear-gradient(135deg, var(--color-accent-600), var(--color-accent)) !important;
        color: white !important;
        font-weight: 700;
        border: 2px solid var(--color-accent-700) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-start="true"]:hover,
    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-end="true"]:hover {
        background: var(--color-accent-hover) !important;
        color: white !important;
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    /* Range hover preview - clearer feedback */
    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-hover-range="true"] {
        background-color: var(--color-accent-100);
        color: var(--color-accent-800);
        border: 1px dashed var(--color-accent-300);
    }

    /* === IMPROVED DARK MODE RANGE STYLES === */
    /* In-range dates - dark mode */
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-in-range="true"] {
        background-color: var(--color-accent-900) !important;
        color: var(--color-accent-300) !important;
        border: 1px solid var(--color-accent-800) !important;
    }

    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-in-range="true"]:hover {
        background-color: var(--color-accent-800) !important;
        color: var(--color-accent-200) !important;
        border-color: var(--color-accent-700) !important;
    }

    /* Range start date - dark mode */
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-start="true"] {
        background: linear-gradient(135deg, var(--color-accent-600), var(--color-accent-500)) !important;
        color: white !important;
        font-weight: 700;
        border: 2px solid var(--color-accent-400) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    /* Range end date - dark mode */
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-end="true"] {
        background: linear-gradient(135deg, var(--color-accent-500), var(--color-accent-600)) !important;
        color: white !important;
        font-weight: 700;
        border: 2px solid var(--color-accent-400) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-start="true"]:hover,
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-end="true"]:hover {
        background: var(--color-accent-500) !important;
        color: white !important;
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        border-color: var(--color-accent-300) !important;
    }

    /* Range hover preview - dark mode */
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-hover-range="true"] {
        background-color: var(--color-accent-800);
        color: var(--color-accent-200);
        border: 1px dashed var(--color-accent-600);
    }

    /* === MONTH/YEAR SELECTION GRIDS === */
    [data-keys-calendar="true"] .month-grid button,
    [data-keys-calendar="true"] .year-grid button {
        transition: all 0.2s ease-in-out;
    }

    [data-keys-calendar="true"] .month-grid button:hover:not(:disabled),
    [data-keys-calendar="true"] .year-grid button:hover:not(:disabled) {
        background-color: var(--color-neutral-hover);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
    }

    /* Month and year grid option buttons */
    [data-keys-calendar="true"] .month-option,
    [data-keys-calendar="true"] .year-option {
        width: 100%;
        justify-content: center;
    }

    /* === MULTI-MONTH LAYOUT === */
    [data-keys-calendar="true"] .calendar-multi-month-grid .calendar-month-header {
        text-align: center;
        font-weight: 600;
        padding: 0.5rem;
        border-bottom: 1px solid var(--color-line);
        margin-bottom: 0.5rem;
    }
</style>
