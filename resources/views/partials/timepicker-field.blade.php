{{-- Hidden form input --}}
<input type="hidden" name="{{ $name }}" value="{{ $value }}" class="timepicker-hidden-input">

{{-- Display input --}}
<div class="relative">
    <input
        type="text"
        id="{{ $uniqueId }}"
        class="{{ $computedInputClasses }}"
        data-timepicker-trigger
        placeholder="{{ $placeholder }}"
        value="{{ $value }}"
        autocomplete="off"
        readonly
        {{ $disabled ? 'disabled' : '' }}
        {{ $required ? 'required' : '' }}
        aria-expanded="false"
        aria-haspopup="listbox"
        role="combobox"
    >

    {{-- Clock icon --}}
    <div class="absolute inset-y-0 right-0 flex items-center">
        @if($clearable && $value)
            <button
                type="button"
                class="flex items-center justify-center w-6 h-6 mr-1 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:text-neutral-600 transition-colors"
                data-timepicker-clear
                aria-label="Clear time"
            >
                <x-keys::icon name="heroicon-o-x-mark" :size="$computedIconSize" />
            </button>
        @endif

        <div class="flex items-center justify-center w-8 h-8 mr-2 text-neutral-400 pointer-events-none">
            <x-keys::icon name="heroicon-o-clock" :size="$computedIconSize" />
        </div>
    </div>
</div>

{{-- Dropdown --}}
<div class="{{ $computedDropdownClasses }} hidden" data-timepicker-dropdown>
    <div class="p-3">
        {{-- Format toggle (only in flexible mode) --}}
        @if($formatMode === 'flexible')
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-border">
                <span class="text-sm font-medium text-foreground">Time Format</span>
                <div class="flex items-center space-x-2">
                    <button
                        type="button"
                        data-timepicker-format="24"
                        class="px-2 py-1 text-xs rounded {{ $format === '24' ? 'bg-brand text-foreground-brand' : 'bg-surface text-muted hover:bg-neutral-100 dark:hover:bg-neutral-800' }} transition-colors"
                    >
                        24h
                    </button>
                    <button
                        type="button"
                        data-timepicker-format="12"
                        class="px-2 py-1 text-xs rounded {{ $format === '12' ? 'bg-brand text-foreground-brand' : 'bg-surface text-muted hover:bg-neutral-100 dark:hover:bg-neutral-800' }} transition-colors"
                    >
                        12h
                    </button>
                </div>
            </div>
        @endif

        {{-- Time selectors --}}
        <div class="grid grid-cols-{{ $showSeconds ? ($format === '12' ? '4' : '3') : ($format === '12' ? '3' : '2') }} gap-2">
            {{-- Hours --}}
            <div class="flex flex-col">
                <label class="text-xs font-medium text-muted mb-1">{{ $format === '12' ? 'Hour' : 'Hours' }}</label>
                <div class="h-24 overflow-y-auto scrollbar-thin border border-border rounded bg-input">
                    @foreach($computedHourOptions as $hour)
                        <button
                            type="button"
                            data-timepicker-hour="{{ $hour }}"
                            class="w-full px-2 py-1 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand transition-colors"
                        >
                            {{ sprintf('%02d', $hour) }}
                        </button>
                    @endforeach
                </div>
            </div>

            {{-- Minutes --}}
            <div class="flex flex-col">
                <label class="text-xs font-medium text-muted mb-1">Minutes</label>
                <div class="h-24 overflow-y-auto scrollbar-thin border border-border rounded bg-input">
                    @foreach($computedMinuteOptions as $minute)
                        <button
                            type="button"
                            data-timepicker-minute="{{ $minute }}"
                            class="w-full px-2 py-1 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand transition-colors"
                        >
                            {{ sprintf('%02d', $minute) }}
                        </button>
                    @endforeach
                </div>
            </div>

            {{-- Seconds (if enabled) --}}
            @if($showSeconds)
                <div class="flex flex-col">
                    <label class="text-xs font-medium text-muted mb-1">Seconds</label>
                    <div class="h-24 overflow-y-auto scrollbar-thin border border-border rounded bg-input">
                        @foreach($computedSecondOptions as $second)
                            <button
                                type="button"
                                data-timepicker-second="{{ $second }}"
                                class="w-full px-2 py-1 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand transition-colors"
                            >
                                {{ sprintf('%02d', $second) }}
                            </button>
                        @endforeach
                    </div>
                </div>
            @endif

            {{-- Period (AM/PM for 12-hour format) --}}
            @if($format === '12')
                <div class="flex flex-col">
                    <label class="text-xs font-medium text-muted mb-1">Period</label>
                    <div class="space-y-1">
                        @foreach($computedPeriodOptions as $period)
                            <button
                                type="button"
                                data-timepicker-period="{{ $period }}"
                                class="w-full px-2 py-2 text-sm text-left border border-border rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand transition-colors"
                            >
                                {{ $period }}
                            </button>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>

        {{-- Action buttons --}}
        <div class="flex items-center justify-between mt-3 pt-2 border-t border-border">
            <button
                type="button"
                data-timepicker-now
                class="px-3 py-1 text-xs bg-surface border border-border rounded text-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
                Now
            </button>
            <div class="flex items-center space-x-2">
                <button
                    type="button"
                    data-timepicker-cancel
                    class="px-3 py-1 text-xs bg-surface border border-border rounded text-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    data-timepicker-apply
                    class="px-3 py-1 text-xs bg-brand rounded text-foreground-brand hover:bg-brand-hover transition-colors"
                >
                    Apply
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    [data-timepicker] {
        /* Component-specific styles using CSS custom properties */
    }

    [data-timepicker-dropdown] {
        /* Smooth dropdown animations */
        animation: slideDown 0.15s ease-out;
    }

    [data-timepicker-dropdown].hidden {
        animation: slideUp 0.15s ease-in;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-4px);
        }
    }

    /* Selected state styling */
    [data-timepicker-hour].selected,
    [data-timepicker-minute].selected,
    [data-timepicker-second].selected,
    [data-timepicker-period].selected {
        background-color: var(--color-brand);
        color: var(--color-foreground-brand);
    }

    /* Focus states */
    [data-timepicker-hour]:focus,
    [data-timepicker-minute]:focus,
    [data-timepicker-second]:focus,
    [data-timepicker-period]:focus {
        outline: 2px solid var(--color-brand);
        outline-offset: -2px;
    }
</style>