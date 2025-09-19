@php
    $wireAttributes = $attributes->whereStartsWith('wire:');
    $containerAttributes = $attributes->whereDoesntStartWith('wire:')->merge([
        'class' => 'date-picker-container relative',
        'data-date-picker' => 'true',
        'data-date-picker-config' => json_encode($calendarData),
        'data-inline' => $inline ? 'true' : 'false',
        'data-disabled' => $disabled ? 'true' : 'false',
        'data-size' => $size,
        'id' => $id . '-container'
    ]);
@endphp

@if($isShorthand())
    <x-keys::field :label="$label" :optional="$optional" :required="$required" :errors="$errors" :showErrors="$showErrors">
        <div {{ $containerAttributes }}>
            @include('keys::components.date-picker-content')
        </div>
    </x-keys::field>
@else
    <div {{ $containerAttributes }}>
        @include('keys::components.date-picker-content')
    </div>
@endif

{{-- Inline styles for DatePicker component --}}
<style>
    /* === BASE DATE PICKER STYLES === */
    [data-date-picker="true"] {
        position: relative;
    }

    /* Date picker input */
    [data-date-picker="true"] .date-picker-input {
        cursor: pointer;
    }

    [data-date-picker="true"] .date-picker-input:read-only {
        cursor: pointer;
        background-color: var(--color-input);
    }

    /* Calendar dropdown */
    [data-date-picker="true"] .date-picker-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 50;
        margin-top: 0.25rem;
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        opacity: 0;
        transform: translateY(-0.5rem) scale(0.95);
        transform-origin: top;
        pointer-events: none;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Dropdown open state */
    [data-date-picker="true"] .date-picker-dropdown.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    }

    /* Dropdown position variants */
    [data-date-picker="true"] .date-picker-dropdown.top {
        top: auto;
        bottom: 100%;
        margin-top: 0;
        margin-bottom: 0.25rem;
        transform-origin: bottom;
    }

    [data-date-picker="true"] .date-picker-dropdown.top.open {
        transform: translateY(0) scale(1);
    }

    /* Inline mode */
    [data-date-picker="true"][data-inline="true"] .date-picker-dropdown {
        position: static;
        margin-top: 0.5rem;
        opacity: 1;
        transform: none;
        pointer-events: auto;
        box-shadow: none;
    }

    /* Action buttons (clear and calendar) use flex layout - no absolute positioning needed */

    /* Quick selectors */
    [data-date-picker="true"] .quick-selectors {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.75rem;
        border-bottom: 1px solid var(--color-border);
        background-color: var(--color-surface-50);
    }

    [data-date-picker="true"]:where(.dark, .dark *) .quick-selectors {
        background-color: var(--color-surface-900);
    }

    [data-date-picker="true"] .quick-selector-btn {
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--color-foreground);
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    [data-date-picker="true"] .quick-selector-btn:hover {
        background-color: var(--color-brand-50);
        border-color: var(--color-brand);
        color: var(--color-brand);
    }

    [data-date-picker="true"]:where(.dark, .dark *) .quick-selector-btn:hover {
        background-color: var(--color-brand-950);
    }

    [data-date-picker="true"] .quick-selector-btn:active {
        transform: scale(0.95);
    }

    /* Left icon positioning (if used) */
    [data-date-picker="true"] .icon-left {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: var(--color-muted);
    }

    /* Icon positions based on size */
    [data-date-picker="true"][data-size="sm"] .icon-left { left: 0.625rem; }
    [data-date-picker="true"][data-size="md"] .icon-left { left: 0.75rem; }
    [data-date-picker="true"][data-size="lg"] .icon-left { left: 0.875rem; }

    /* Error state */
    [data-date-picker="true"].has-error .date-picker-input {
        border-color: var(--color-danger);
    }

    [data-date-picker="true"].has-error .date-picker-input:focus {
        ring-color: var(--color-danger);
    }

    /* Disabled state */
    [data-date-picker="true"][data-disabled="true"] .date-picker-input {
        opacity: 0.6;
        cursor: not-allowed;
    }

    [data-date-picker="true"][data-disabled="true"] .date-picker-trigger,
    [data-date-picker="true"][data-disabled="true"] .date-picker-clear {
        pointer-events: none;
        opacity: 0.6;
    }

    /* Custom trigger button styles */
    [data-date-picker="true"] .custom-trigger {
        cursor: pointer;
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
        [data-date-picker="true"] .date-picker-dropdown {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 90%;
            max-width: 360px;
            max-height: 80vh;
            overflow-y: auto;
        }

        [data-date-picker="true"] .date-picker-dropdown.open {
            transform: translate(-50%, -50%) scale(1);
        }

        [data-date-picker="true"][data-inline="true"] .date-picker-dropdown {
            position: static;
            transform: none;
            width: 100%;
            max-width: none;
        }
    }

    /* Animation for dropdown appear/disappear */
    @keyframes datePickerSlideDown {
        from {
            opacity: 0;
            transform: translateY(-0.5rem) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes datePickerSlideUp {
        from {
            opacity: 0;
            transform: translateY(0.5rem) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    [data-date-picker="true"] .date-picker-dropdown.animating-in {
        animation: datePickerSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    [data-date-picker="true"] .date-picker-dropdown.top.animating-in {
        animation: datePickerSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
</style>