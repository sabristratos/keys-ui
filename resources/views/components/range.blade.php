@php
    $inputId = $uniqueId;
    $wrapperClasses = $computedContainerClasses;
    $livewireAttributes = $attributes->whereStartsWith('wire:');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:');
@endphp

@if($isShorthand())
    <div class="space-y-2">
        <x-keys::label :for="$inputId" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div {{ $wrapperAttributes->except(['class'])->merge(['class' => $wrapperClasses, 'data-range' => 'true']) }}>
            {{-- Main range component content --}}
            @include('keys::components.range.content')
        </div>

        @if($showErrors && $hasError())
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $wrapperAttributes->except(['class'])->merge(['class' => $wrapperClasses, 'data-range' => 'true']) }}>
        {{-- Main range component content --}}
        @include('keys::components.range.content')
    </div>
@endif

@once
    <style>
        [data-range="true"] {
            user-select: none;
            touch-action: pan-y;
        }

        [data-range="true"] .range-track {
            position: relative;
            cursor: pointer;
        }

        [data-range="true"] .range-handle {
            z-index: 20;
            outline: none;
            transform-origin: center;
            transition: transform 150ms ease-out;
        }

        [data-range="true"] .range-handle:focus {
            z-index: 30;
        }

        [data-range="true"] .range-handle:hover {
            transform: scale(1.1);
        }

        [data-range="true"] .range-handle:active,
        [data-range="true"] .range-handle.dragging {
            transform: scale(1.2);
            z-index: 30;
            transition: none;
        }

        [data-range="true"] .range-fill {
            pointer-events: none;
        }

        /* Disable transitions on fill during dragging for smooth tracking */
        [data-range="true"].dragging .range-fill {
            transition: none;
        }

        [data-range="true"] .range-value-display {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 4px 8px;
            background: var(--color-neutral);
            color: var(--color-foreground);
            font-size: 12px;
            border-radius: 4px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 200ms ease;
            pointer-events: none;
            z-index: 40;
        }

        [data-range="true"] .range-handle:hover .range-value-display,
        [data-range="true"] .range-handle:focus .range-value-display,
        [data-range="true"] .range-handle.dragging .range-value-display,
        [data-range="true"].show-values .range-value-display {
            opacity: 1;
        }

        [data-range="true"] .range-tick {
            position: absolute;
            top: 0;
            width: 2px;
            height: 100%;
            background: var(--color-border);
            transform: translateX(-50%);
            pointer-events: none;
        }

        [data-range="true"] .range-tick-label {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 8px;
            font-size: 11px;
            color: var(--color-muted);
            white-space: nowrap;
            pointer-events: none;
        }

        [data-range="true"] .range-track:hover .range-tick {
            background: var(--color-neutral);
        }

        /* Hidden native inputs for form submission and accessibility */
        [data-range="true"] input[type="range"] {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            width: 100%;
            height: 100%;
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
            [data-range="true"] .range-value-display {
                background: var(--color-surface);
                border: 1px solid var(--color-border);
            }
        }

        /* Disabled state */
        [data-range="true"][data-disabled="true"] {
            pointer-events: none;
            opacity: 0.6;
        }

        [data-range="true"][data-disabled="true"] .range-handle {
            cursor: not-allowed;
        }

        /* Focus visible for keyboard navigation */
        [data-range="true"] .range-handle:focus-visible {
            outline: 2px solid var(--color-brand);
            outline-offset: 2px;
        }
    </style>
@endonce

{{-- Hidden inputs for form submission --}}
@if($dual)
    <input type="hidden"
           name="{{ $name }}[0]"
           value="{{ $computedValue[0] }}"
           data-range-input="min"
           {{ $livewireAttributes }} />
    <input type="hidden"
           name="{{ $name }}[1]"
           value="{{ $computedValue[1] }}"
           data-range-input="max"
           {{ $livewireAttributes }} />
@else
    <input type="hidden"
           name="{{ $name }}"
           value="{{ $computedValue }}"
           data-range-input="single"
           {{ $livewireAttributes }} />
@endif