@php
    $wireAttributes = $attributes->whereStartsWith('wire:');
    $containerAttributes = $attributes->whereDoesntStartWith('wire:')->merge([
        'class' => $computedCalendarClasses,
        'data-calendar' => 'true',
        'data-is-range' => $isRange ? 'true' : 'false',
        'data-name' => $name,
        'data-size' => $size,
        'data-disabled' => $disabled ? 'true' : 'false',
        'data-calendar-data' => json_encode($computedInitialData),
        'id' => $uniqueId
    ]);
@endphp

@if($isShorthand())
    <x-keys::field :label="$label" :optional="$optional" :required="$required" :errors="$errors" :showErrors="$showErrors">
        @include('keys::partials.calendar-content')
    </x-keys::field>
@else
    @include('keys::partials.calendar-content')
@endif

{{-- Inline styles for Calendar component --}}
<style>
    /* === BASE CALENDAR STYLES === */
    [data-calendar="true"] {
        min-width: 280px;
        user-select: none;
    }

    /* Disabled component styling */
    [data-calendar="true"][data-disabled="true"] {
        opacity: 0.6;
        pointer-events: none;
    }

    /* Error state styling */
    [data-calendar="true"].border-danger {
        border-color: var(--color-danger);
    }

    /* === CALENDAR DAY BUTTONS === */
    [data-calendar="true"] .calendar-day button {
        width: 100%;
        aspect-ratio: 1;
        padding: 0.25rem;
        font-size: inherit;
        transition: all 0.2s ease-in-out, transform 0.1s ease-in-out;
    }

    /* Interactive states */
    [data-calendar="true"]:not([data-is-range="true"]) .calendar-day button:not(:disabled):hover {
        background-color: var(--color-neutral-hover);
    }

    [data-calendar="true"] .calendar-day button:active:not(:disabled) {
        transform: scale(0.95);
    }

    [data-calendar="true"] .calendar-day button:focus-visible {
        outline: 2px solid var(--color-brand);
        outline-offset: 2px;
        z-index: 1;
    }

    [data-calendar="true"] .calendar-day button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    /* Selected date styling */
    [data-calendar="true"] .calendar-day button[aria-selected="true"] {
        background-color: var(--color-brand);
        color: var(--color-foreground-brand);
    }

    [data-calendar="true"] .calendar-day button[aria-selected="true"]:hover {
        background-color: var(--color-brand-hover);
    }

    /* Today styling */
    [data-calendar="true"] .calendar-day button[data-is-today="true"]:not([aria-selected="true"]) {
        background-color: var(--color-brand-50);
        color: var(--color-brand);
        border: 1px solid var(--color-brand-200);
    }

    [data-calendar="true"]:where(.dark, .dark *) .calendar-day button[data-is-today="true"]:not([aria-selected="true"]) {
        background-color: var(--color-brand-950);
        color: var(--color-brand-400);
        border: 1px solid var(--color-brand-800);
    }

    /* === SIZE VARIANTS === */
    [data-calendar="true"][data-size="sm"] .calendar-day {
        width: 2rem;
        height: 2rem;
        font-size: 0.75rem;
    }

    [data-calendar="true"][data-size="md"] .calendar-day {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 0.875rem;
    }

    [data-calendar="true"][data-size="lg"] .calendar-day {
        width: 3rem;
        height: 3rem;
        font-size: 1rem;
    }

    /* === NAVIGATION BUTTONS === */
    [data-calendar="true"] .calendar-nav-btn:hover:not(:disabled) {
        background-color: var(--color-neutral-hover);
    }

    /* Month and year grid option buttons */
    [data-calendar="true"] .month-option,
    [data-calendar="true"] .year-option {
        width: 100%;
        justify-content: center;
    }

    /* === MONTH/YEAR SELECTION GRIDS === */
    [data-calendar="true"] .month-grid button,
    [data-calendar="true"] .year-grid button {
        transition: all 0.2s ease-in-out;
    }

    [data-calendar="true"] .month-grid button:hover:not(:disabled),
    [data-calendar="true"] .year-grid button:hover:not(:disabled) {
        background-color: var(--color-neutral-hover);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
    }

    /* === CALENDAR GRID TRANSITIONS === */
    [data-calendar="true"] .calendar-grid {
        transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    }

    /* === RANGE SELECTION STYLES === */
    [data-calendar="true"][data-is-range="true"] .calendar-day button[data-is-in-range="true"] {
        background-color: var(--color-brand-50) !important;
        color: var(--color-brand-600) !important;
        border-color: var(--color-brand-100) !important;
        position: relative;
    }

    [data-calendar="true"][data-is-range="true"] .calendar-day button[data-is-in-range="true"]:hover {
        background-color: var(--color-brand-100) !important;
        color: var(--color-brand-700) !important;
    }

    /* Range start and end dates */
    [data-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-start="true"],
    [data-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-end="true"] {
        background-color: var(--color-brand) !important;
        color: white !important;
        font-weight: 600;
    }

    [data-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-start="true"]:hover,
    [data-calendar="true"][data-is-range="true"] .calendar-day button[data-is-range-end="true"]:hover {
        background-color: var(--color-brand-hover) !important;
        color: white !important;
    }

    /* Range hover preview */
    [data-calendar="true"][data-is-range="true"] .calendar-day button[data-is-hover-range="true"] {
        background-color: var(--color-brand-100);
        color: var(--color-brand-700);
    }


    /* === DARK MODE RANGE STYLES === */
    [data-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-in-range="true"] {
        background-color: var(--color-brand-950) !important;
        color: var(--color-brand-400) !important;
        border-color: var(--color-brand-900) !important;
    }

    [data-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-in-range="true"]:hover {
        background-color: var(--color-brand-900) !important;
        color: var(--color-brand-300) !important;
    }

    [data-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-start="true"],
    [data-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-end="true"] {
        background-color: var(--color-brand-600);
        color: white;
        border-color: var(--color-brand-500);
    }

    [data-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-start="true"]:hover,
    [data-calendar="true"][data-is-range="true"]:where(.dark, .dark *) .calendar-day button[data-is-range-end="true"]:hover {
        background-color: var(--color-brand-500);
        border-color: var(--color-brand-400);
    }

    /* === MULTI-MONTH LAYOUT === */
    [data-calendar="true"][data-months-to-show="2"] {
        min-width: 600px;
    }

    [data-calendar="true"][data-months-to-show="3"] {
        min-width: 900px;
    }

    [data-calendar="true"] .calendar-multi-month-grid {
        display: grid;
        gap: 2rem;
    }

    [data-calendar="true"] .calendar-multi-month-grid .calendar-month-header {
        text-align: center;
        font-weight: 600;
        padding: 0.5rem;
        border-bottom: 1px solid var(--color-border);
        margin-bottom: 0.5rem;
    }

    /* === CALENDAR FOOTER === */
    [data-calendar="true"] .calendar-footer {
        background-color: var(--color-surface);
    }

    [data-calendar="true"] .calendar-action-btn {
        min-width: 64px;
    }
</style>