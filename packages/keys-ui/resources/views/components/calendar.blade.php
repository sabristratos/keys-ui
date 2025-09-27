@php
    $wireAttributes = $attributes->whereStartsWith('wire:');

    // Calendar base styling using direct Tailwind utilities
    $baseWidth = $monthsToShow > 1 ? 'min-w-[560px] w-full' : 'min-w-[280px] w-max';
    $baseClasses = 'user-select-none text-foreground';

    // Size-based styling
    $sizeClasses = match ($size) {
        'sm' => 'text-sm',
        'md' => 'text-sm',
        'lg' => 'text-base',
        default => 'text-sm'
    };

    // State-based styling
    $stateClasses = '';
    if ($disabled) {
        $stateClasses = 'opacity-60 pointer-events-none';
    } elseif ($hasError()) {
        $stateClasses = 'border-danger';
    } else {
        $stateClasses = 'border-border hover:border-neutral-300 dark:hover:border-neutral-600';
    }

    // Header size styling
    $headerClasses = match ($size) {
        'sm' => 'px-3 py-2 text-sm font-medium',
        'md' => 'px-4 py-3 text-sm font-semibold',
        'lg' => 'px-5 py-4 text-base font-semibold',
        default => 'px-4 py-3 text-sm font-semibold'
    };

    // Cell size styling
    $cellClasses = match ($size) {
        'sm' => 'w-8 h-8 text-xs',
        'md' => 'w-10 h-10 text-sm',
        'lg' => 'w-12 h-12 text-base',
        default => 'w-10 h-10 text-sm'
    };

    $containerAttributes = $attributes->whereDoesntStartWith('wire:')->merge([
        'class' => trim($baseWidth . ' ' . $baseClasses . ' ' . $sizeClasses . ' ' . $stateClasses),
        'data-calendar-data' => json_encode($computedInitialData),
    ])->merge($dataAttributes);
@endphp

@if($isShorthand())
    <x-keys::field :label="$label" :optional="$optional" :required="$required" :errors="$errors" :showErrors="$showErrors">
        <div {{ $containerAttributes }}>
            @include('keys::partials.calendar-body')
        </div>
    </x-keys::field>
@else
    <div {{ $containerAttributes }}>
        @include('keys::partials.calendar-body')
    </div>
@endif

{{-- Calendar component now uses Tailwind utilities and JavaScript-based dynamic styling --}}
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
        background-color: var(--color-brand-50) !important;
        color: var(--color-brand-700) !important;
        border: 1px solid var(--color-brand-100) !important;
        position: relative;
    }

    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-in-range="true"]:hover {
        background-color: var(--color-brand-100) !important;
        color: var(--color-brand-800) !important;
        border-color: var(--color-brand-200) !important;
    }

    /* Range start date - distinct styling with gradient */
    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-start="true"] {
        background: linear-gradient(135deg, var(--color-brand), var(--color-brand-600)) !important;
        color: white !important;
        font-weight: 700;
        border: 2px solid var(--color-brand-700) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Range end date - distinct styling with different gradient */
    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-end="true"] {
        background: linear-gradient(135deg, var(--color-brand-600), var(--color-brand)) !important;
        color: white !important;
        font-weight: 700;
        border: 2px solid var(--color-brand-700) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-start="true"]:hover,
    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-end="true"]:hover {
        background: var(--color-brand-hover) !important;
        color: white !important;
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    /* Range hover preview - clearer feedback */
    [data-keys-calendar="true"][data-is-range="true"] .calendar-day button[data-is-hover-range="true"] {
        background-color: var(--color-brand-100);
        color: var(--color-brand-800);
        border: 1px dashed var(--color-brand-300);
    }

    /* === IMPROVED DARK MODE RANGE STYLES === */
    /* In-range dates - dark mode */
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-in-range="true"] {
        background-color: var(--color-brand-900) !important;
        color: var(--color-brand-300) !important;
        border: 1px solid var(--color-brand-800) !important;
    }

    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-in-range="true"]:hover {
        background-color: var(--color-brand-800) !important;
        color: var(--color-brand-200) !important;
        border-color: var(--color-brand-700) !important;
    }

    /* Range start date - dark mode */
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-start="true"] {
        background: linear-gradient(135deg, var(--color-brand-600), var(--color-brand-500)) !important;
        color: white !important;
        font-weight: 700;
        border: 2px solid var(--color-brand-400) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    /* Range end date - dark mode */
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-end="true"] {
        background: linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600)) !important;
        color: white !important;
        font-weight: 700;
        border: 2px solid var(--color-brand-400) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-start="true"]:hover,
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-end="true"]:hover {
        background: var(--color-brand-500) !important;
        color: white !important;
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        border-color: var(--color-brand-300) !important;
    }

    /* Range hover preview - dark mode */
    [data-keys-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-hover-range="true"] {
        background-color: var(--color-brand-800);
        color: var(--color-brand-200);
        border: 1px dashed var(--color-brand-600);
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
        border-bottom: 1px solid var(--color-border);
        margin-bottom: 0.5rem;
    }
</style>