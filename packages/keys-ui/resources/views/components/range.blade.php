@php
    $inputId = $uniqueId;
    $livewireAttributes = $attributes->whereStartsWith('wire:');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:');

    // Container classes - direct Tailwind utilities
    $baseClasses = 'relative';
    $spacingClasses = match ($size) {
        'xs' => 'px-1 py-2',
        'sm' => 'px-2 py-3',
        'md' => 'px-3 py-4',
        'lg' => 'px-4 py-5',
        'xl' => 'px-5 py-6',
        default => 'px-3 py-4'
    };
    $wrapperClasses = "$baseClasses $spacingClasses";

    // Track classes - direct Tailwind utilities
    $trackBaseClasses = 'relative rounded-full transition-colors duration-200';
    $trackSizeClasses = match ($size) {
        'xs' => 'h-0.5',
        'sm' => 'h-1',
        'md' => 'h-2',
        'lg' => 'h-3',
        'xl' => 'h-4',
        default => 'h-2'
    };
    $trackStateClasses = $disabled
        ? 'bg-neutral-200 dark:bg-neutral-700'
        : 'bg-neutral-200 dark:bg-neutral-700';
    $trackClasses = "$trackBaseClasses $trackSizeClasses $trackStateClasses";

    // Handle classes - direct Tailwind utilities with touch-friendly targets
    $handleSizeClasses = match ($size) {
        'xs' => 'w-3 h-3',
        'sm' => 'w-4 h-4',
        'md' => 'w-5 h-5',
        'lg' => 'w-6 h-6',
        'xl' => 'w-7 h-7',
        default => 'w-5 h-5'
    };
    $handleBaseClasses = "absolute $handleSizeClasses rounded-full border-2 transition-all duration-200 ease-out transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 active:scale-125 focus:z-30";

    // Touch target classes for better mobile interaction (minimum 44px)
    $touchTargetClasses = 'before:absolute before:inset-0 before:w-11 before:h-11 before:-translate-x-1/2 before:-translate-y-1/2 before:left-1/2 before:top-1/2 before:content-[""] before:cursor-pointer';
    if ($disabled) {
        $handleStateClasses = 'bg-neutral-100 border-neutral-300 cursor-not-allowed';
    } elseif ($hasError()) {
        $handleStateClasses = 'bg-white border-danger shadow-sm hover:shadow-md focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2';
    } else {
        $handleStateClasses = 'bg-white border-brand shadow-sm hover:shadow-md focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2';
    }
    $handleClasses = "$handleBaseClasses $handleStateClasses $touchTargetClasses";

    // Fill classes - direct Tailwind utilities
    $fillBaseClasses = 'absolute h-full rounded-full transition-all duration-200';
    $fillStateClasses = $hasError() ? 'bg-danger' : 'bg-brand';
    $fillClasses = "$fillBaseClasses $fillStateClasses";
@endphp

@if($isShorthand())
    <div class="space-y-2">
        <x-keys::label :for="$inputId" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div {{ $wrapperAttributes->except(['class'])->merge(['class' => $wrapperClasses, 'data-range' => 'true'])->merge($dataAttributes) }}>
            {{-- Range track container --}}
            <div class="{{ $trackClasses }} range-track"
                 data-min="{{ $min }}"
                 data-max="{{ $max }}"
                 data-step="{{ $step }}"
                 data-dual="{{ $dual ? 'true' : 'false' }}"
                 data-disabled="{{ $disabled ? 'true' : 'false' }}"
                 @if(!empty($computedTicks))
                     data-ticks="{{ json_encode(array_column($computedTicks, 'value')) }}"
                 @endif
                 @if($showValues)
                     class="{{ $trackClasses }} range-track show-values"
                 @endif>

                {{-- Range fill (the colored part) --}}
                @if($dual)
                    <div class="{{ $fillClasses }} range-fill"
                         style="left: {{ $computedPercentage[0] }}%; width: {{ $computedPercentage[1] - $computedPercentage[0] }}%;"></div>
                @else
                    <div class="{{ $fillClasses }} range-fill"
                         style="width: {{ $computedPercentage }}%;"></div>
                @endif

                {{-- Tick marks --}}
                @if($showTicks && !empty($computedTicks))
                    @foreach($computedTicks as $tick)
                        <div class="range-tick" style="left: {{ $tick['percentage'] }}%;">
                            <div class="range-tick-label">{{ $tick['label'] }}</div>
                        </div>
                    @endforeach
                @endif

                {{-- Range handles --}}
                @if($dual)
                    {{-- Min handle --}}
                    <div class="{{ $handleClasses }} range-handle"
                         style="left: {{ $computedPercentage[0] }}%; top: 50%;"
                         tabindex="{{ $disabled ? '-1' : '0' }}"
                         role="slider"
                         aria-label="Minimum value"
                         aria-valuemin="{{ $min }}"
                         aria-valuemax="{{ $maxValue }}"
                         aria-valuenow="{{ $minValue }}"
                         aria-valuetext="{{ $minValue }}"
                         data-handle="min">

                        @if($showValues)
                            <div class="range-value-display" data-value-display="min">
                                {{ $minValue }}
                            </div>
                        @endif
                    </div>

                    {{-- Max handle --}}
                    <div class="{{ $handleClasses }} range-handle"
                         style="left: {{ $computedPercentage[1] }}%; top: 50%;"
                         tabindex="{{ $disabled ? '-1' : '0' }}"
                         role="slider"
                         aria-label="Maximum value"
                         aria-valuemin="{{ $minValue }}"
                         aria-valuemax="{{ $max }}"
                         aria-valuenow="{{ $maxValue }}"
                         aria-valuetext="{{ $maxValue }}"
                         data-handle="max">

                        @if($showValues)
                            <div class="range-value-display" data-value-display="max">
                                {{ $maxValue }}
                            </div>
                        @endif
                    </div>
                @else
                    {{-- Single handle --}}
                    <div class="{{ $handleClasses }} range-handle"
                         style="left: {{ $computedPercentage }}%; top: 50%;"
                         tabindex="{{ $disabled ? '-1' : '0' }}"
                         role="slider"
                         aria-label="Value"
                         aria-valuemin="{{ $min }}"
                         aria-valuemax="{{ $max }}"
                         aria-valuenow="{{ $value }}"
                         aria-valuetext="{{ $value }}"
                         data-handle="single">

                        @if($showValues)
                            <div class="range-value-display" data-value-display="single">
                                {{ $value }}
                            </div>
                        @endif
                    </div>
                @endif

                {{-- Native range inputs for accessibility (hidden) --}}
                @if($dual)
                    <input type="range"
                           id="{{ $inputId }}-min"
                           min="{{ $min }}"
                           max="{{ $max }}"
                           step="{{ $step }}"
                           value="{{ $minValue }}"
                           {{ $disabled ? 'disabled' : '' }}
                           {{ $required ? 'required' : '' }}
                           data-native-input="min"
                           aria-label="Minimum value" />

                    <input type="range"
                           id="{{ $inputId }}-max"
                           min="{{ $min }}"
                           max="{{ $max }}"
                           step="{{ $step }}"
                           value="{{ $maxValue }}"
                           {{ $disabled ? 'disabled' : '' }}
                           {{ $required ? 'required' : '' }}
                           data-native-input="max"
                           aria-label="Maximum value" />
                @else
                    <input type="range"
                           id="{{ $inputId }}"
                           min="{{ $min }}"
                           max="{{ $max }}"
                           step="{{ $step }}"
                           value="{{ $value }}"
                           {{ $disabled ? 'disabled' : '' }}
                           {{ $required ? 'required' : '' }}
                           data-native-input="single"
                           aria-label="Value" />
                @endif
            </div>
        </div>

        @if($hint)
            <p class="text-xs text-muted">{{ $hint }}</p>
        @endif

        @if($showErrors && $hasError())
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $wrapperAttributes->except(['class'])->merge(['class' => $wrapperClasses, 'data-range' => 'true'])->merge($dataAttributes) }}>
        {{-- Range track container --}}
        <div class="{{ $trackClasses }} range-track"
             data-min="{{ $min }}"
             data-max="{{ $max }}"
             data-step="{{ $step }}"
             data-dual="{{ $dual ? 'true' : 'false' }}"
             data-disabled="{{ $disabled ? 'true' : 'false' }}"
             @if(!empty($computedTicks))
                 data-ticks="{{ json_encode(array_column($computedTicks, 'value')) }}"
             @endif
             @if($showValues)
                 class="{{ $trackClasses }} range-track show-values"
             @endif>

            {{-- Range fill (the colored part) --}}
            @if($dual)
                <div class="{{ $fillClasses }} range-fill"
                     style="left: {{ $computedPercentage[0] }}%; width: {{ $computedPercentage[1] - $computedPercentage[0] }}%;"></div>
            @else
                <div class="{{ $fillClasses }} range-fill"
                     style="width: {{ $computedPercentage }}%;"></div>
            @endif

            {{-- Tick marks --}}
            @if($showTicks && !empty($computedTicks))
                @foreach($computedTicks as $tick)
                    <div class="range-tick" style="left: {{ $tick['percentage'] }}%;">
                        <div class="range-tick-label">{{ $tick['label'] }}</div>
                    </div>
                @endforeach
            @endif

            {{-- Range handles --}}
            @if($dual)
                {{-- Min handle --}}
                <div class="{{ $handleClasses }} range-handle"
                     style="left: {{ $computedPercentage[0] }}%; top: 50%;"
                     tabindex="{{ $disabled ? '-1' : '0' }}"
                     role="slider"
                     aria-label="Minimum value"
                     aria-valuemin="{{ $min }}"
                     aria-valuemax="{{ $maxValue }}"
                     aria-valuenow="{{ $minValue }}"
                     aria-valuetext="{{ $minValue }}"
                     data-handle="min">

                    @if($showValues)
                        <div class="range-value-display" data-value-display="min">
                            {{ $minValue }}
                        </div>
                    @endif
                </div>

                {{-- Max handle --}}
                <div class="{{ $handleClasses }} range-handle"
                     style="left: {{ $computedPercentage[1] }}%; top: 50%;"
                     tabindex="{{ $disabled ? '-1' : '0' }}"
                     role="slider"
                     aria-label="Maximum value"
                     aria-valuemin="{{ $minValue }}"
                     aria-valuemax="{{ $max }}"
                     aria-valuenow="{{ $maxValue }}"
                     aria-valuetext="{{ $maxValue }}"
                     data-handle="max">

                    @if($showValues)
                        <div class="range-value-display" data-value-display="max">
                            {{ $maxValue }}
                        </div>
                    @endif
                </div>
            @else
                {{-- Single handle --}}
                <div class="{{ $handleClasses }} range-handle"
                     style="left: {{ $computedPercentage }}%; top: 50%;"
                     tabindex="{{ $disabled ? '-1' : '0' }}"
                     role="slider"
                     aria-label="Value"
                     aria-valuemin="{{ $min }}"
                     aria-valuemax="{{ $max }}"
                     aria-valuenow="{{ $value }}"
                     aria-valuetext="{{ $value }}"
                     data-handle="single">

                    @if($showValues)
                        <div class="range-value-display" data-value-display="single">
                            {{ $value }}
                        </div>
                    @endif
                </div>
            @endif

            {{-- Native range inputs for accessibility (hidden) --}}
            @if($dual)
                <input type="range"
                       id="{{ $inputId }}-min"
                       min="{{ $min }}"
                       max="{{ $max }}"
                       step="{{ $step }}"
                       value="{{ $minValue }}"
                       {{ $disabled ? 'disabled' : '' }}
                       {{ $required ? 'required' : '' }}
                       data-native-input="min"
                       aria-label="Minimum value" />

                <input type="range"
                       id="{{ $inputId }}-max"
                       min="{{ $min }}"
                       max="{{ $max }}"
                       step="{{ $step }}"
                       value="{{ $maxValue }}"
                       {{ $disabled ? 'disabled' : '' }}
                       {{ $required ? 'required' : '' }}
                       data-native-input="max"
                       aria-label="Maximum value" />
            @else
                <input type="range"
                       id="{{ $inputId }}"
                       min="{{ $min }}"
                       max="{{ $max }}"
                       step="{{ $step }}"
                       value="{{ $value }}"
                       {{ $disabled ? 'disabled' : '' }}
                       {{ $required ? 'required' : '' }}
                       data-native-input="single"
                       aria-label="Value" />
            @endif
        </div>
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

        /* Enhanced focus-visible for better accessibility */
        [data-range="true"] .range-handle:focus-visible {
            outline: 3px solid var(--color-brand);
            outline-offset: 3px;
        }

        /* Dragging state for smooth interaction */
        [data-range="true"] .range-handle.dragging {
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
            transform: translateX(-50%) translateY(-4px);
            margin-bottom: 8px;
            padding: 6px 10px;
            background: var(--color-surface);
            color: var(--color-foreground);
            font-size: 12px;
            font-weight: 500;
            border-radius: 6px;
            border: 1px solid var(--color-border);
            white-space: nowrap;
            opacity: 0;
            transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
            pointer-events: none;
            z-index: 40;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        [data-range="true"] .range-handle:hover .range-value-display,
        [data-range="true"] .range-handle:focus .range-value-display,
        [data-range="true"] .range-handle.dragging .range-value-display,
        [data-range="true"].show-values .range-value-display {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        [data-range="true"] .range-tick {
            position: absolute;
            top: 0;
            width: 2px;
            height: 100%;
            background: none;
            transform: translateX(-50%);
            pointer-events: none;
        }

        /* Hide tick lines for first and last ticks (endpoints) */
        [data-range="true"] .range-tick:first-child::before,
        [data-range="true"] .range-tick:last-child::before {
            display: none;
        }

        /* Use ::before pseudo-element for tick lines to allow selective hiding */
        [data-range="true"] .range-tick::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 100%;
            background: var(--color-border);
            transform: translateX(-50%);
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

        [data-range="true"] .range-track:hover .range-tick::before {
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

        /* Reduced motion support for accessibility */
        @media (prefers-reduced-motion: reduce) {
            [data-range="true"] .range-handle {
                transition: none !important;
            }

            [data-range="true"] .range-value-display {
                transition: opacity 150ms ease !important;
            }

            [data-range="true"] .range-fill {
                transition: none !important;
            }
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