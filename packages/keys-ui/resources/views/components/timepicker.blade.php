@php
    // Separate wire: attributes for Livewire integration
    $wireOnlyAttributes = $attributes->whereStartsWith('wire:');
    $nonWireAttributes = $attributes->whereDoesntStartWith('wire:');
    $isLivewireEnabled = $wireOnlyAttributes->isNotEmpty();

    // Add Livewire data attributes when enabled
    if ($isLivewireEnabled) {
        $dataAttributes = array_merge($dataAttributes, [
            'data-livewire-enabled' => 'true',
            'data-livewire-mode' => 'true',
        ]);

        $wireModelName = $wireOnlyAttributes->whereStartsWith('wire:model')->first();
        if ($wireModelName) {
            $dataAttributes['data-wire-model'] = $wireModelName;
            $dataAttributes['data-livewire-property'] = $wireModelName;
        }
    }

    // Merge all component attributes
    $timePickerAttributes = $nonWireAttributes
        ->except(['class'])
        ->merge($dataAttributes);

    // Base classes for trigger input
    $baseClasses = 'flex items-center justify-between w-full rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer';

    // Size classes
    $sizeClasses = match ($size) {
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-3 py-2 text-sm',
        'lg' => 'px-4 py-2.5 text-base',
        default => 'px-3 py-2 text-sm'
    };

    // State classes
    $stateClasses = '';
    if ($disabled) {
        $stateClasses = 'bg-surface border-border text-muted cursor-not-allowed opacity-50';
    } elseif ($hasError()) {
        $stateClasses = 'bg-input border-danger text-foreground focus-visible:border-danger focus-visible:ring-danger';
    } else {
        $stateClasses = 'bg-input border-border text-foreground focus-visible:border-brand focus-visible:ring-brand hover:border-neutral';
    }

    // Icon size based on component size
    $iconSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    // Right padding for icon - consistent regardless of clearable state
    $rightPadding = match ($size) {
        'sm' => 'pr-3',
        'md' => 'pr-4',
        'lg' => 'pr-5',
        default => 'pr-4'
    };

    $triggerClasses = "$baseClasses $sizeClasses $stateClasses $rightPadding";

    // Dropdown width should be constrained for TimePicker
    $dropdownWidthClasses = 'w-auto min-w-full max-w-md';
@endphp

<div {{ $attributes->only('class') }} @if(!$isShorthand()) {{ $timePickerAttributes }} @endif>
    @if($isShorthand())
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1" {{ $timePickerAttributes }}>
    @endif

    {{-- Hidden form input --}}
    <input type="hidden" name="{{ $name }}" value="{{ $value }}" data-timepicker-hidden-input>

    {{-- Popover-based TimePicker --}}
    <x-keys::popover
        class="w-full"
        :id="'timepicker-dropdown-' . $id"
        placement="bottom-start"
        :manual="false"
    >
        <x-slot name="trigger">
            <div class="relative">
                <button
                    type="button"
                    id="{{ $id }}"
                    class="{{ $triggerClasses }}"
                    data-popover-trigger="timepicker-dropdown-{{ $id }}"
                    data-timepicker-trigger
                    role="combobox"
                    aria-expanded="false"
                    aria-haspopup="dialog"
                    {{ $disabled ? 'disabled aria-disabled=true' : '' }}
                    {{ $required ? 'aria-required=true' : '' }}
                    {{ $wireOnlyAttributes }}
                >
                    <div class="flex items-center flex-1 min-w-0">
                        <div class="timepicker-display flex justify-start flex-1">
                            <span class="timepicker-value truncate" data-timepicker-display>
                                @if($value)
                                    {{ $value }}
                                @else
                                    <span class="text-muted timepicker-placeholder">{{ $placeholder ?: 'Select time...' }}</span>
                                @endif
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center">
                        <x-keys::icon
                            name="heroicon-o-clock"
                            size="{{ $iconSize }}"
                            class="text-muted timepicker-icon transition-transform duration-200"
                        />
                    </div>
                </button>

                {{-- Absolutely positioned overlay for clear button --}}
                @if($clearable && !$disabled)
                    <div class="absolute inset-0 flex justify-between items-center pointer-events-none px-3 py-2">
                        <div class="flex-1"></div>
                        <x-keys::button
                            type="button"
                            variant="ghost"
                            size="xs"
                            class="opacity-0 pointer-events-none transition-opacity duration-150 text-muted hover:text-danger ml-auto mr-6"
                            data-timepicker-clear
                            aria-label="Clear time"
                        >
                            <x-keys::icon name="heroicon-o-x-mark" size="xs" />
                        </x-keys::button>
                    </div>
                @endif
            </div>
        </x-slot>

        {{-- TimePicker Content --}}
        <div class="{{ $dropdownWidthClasses }}">
            {{-- Format toggle (only in flexible mode) --}}
            @if($formatMode === 'flexible')
                <div class="flex items-center justify-between mb-3 pb-2 border-b border-border">
                    <span class="text-sm font-medium text-foreground">Time Format</span>
                    <div class="flex items-center space-x-2">
                        <x-keys::button
                            variant="{{ $format === '24' ? 'brand' : 'outline' }}"
                            size="xs"
                            data-timepicker-format="24"
                        >
                            24h
                        </x-keys::button>
                        <x-keys::button
                            variant="{{ $format === '12' ? 'brand' : 'outline' }}"
                            size="xs"
                            data-timepicker-format="12"
                        >
                            12h
                        </x-keys::button>
                    </div>
                </div>
            @endif

            {{-- Time selectors --}}
            <div class="grid gap-3" data-timepicker-grid
                 style="grid-template-columns: repeat({{ $showSeconds ? ($format === '12' ? '4' : '3') : ($format === '12' ? '3' : '2') }}, 1fr);">
                {{-- Hours --}}
                <div class="flex flex-col">
                    <label class="text-xs font-medium text-muted mb-2">{{ $format === '12' ? 'Hour' : 'Hours' }}</label>
                    <div class="h-32 overflow-y-auto border border-border rounded bg-input scrollbar-thin" data-timepicker-hours>
                        @foreach($hourOptions as $hour)
                            <button
                                type="button"
                                data-timepicker-hour="{{ $hour }}"
                                class="w-full px-3 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:bg-brand focus-visible:text-foreground-brand [&.selected]:bg-brand [&.selected]:text-foreground-brand transition-colors"
                            >
                                {{ sprintf('%02d', $hour) }}
                            </button>
                        @endforeach
                    </div>
                </div>

                {{-- Minutes --}}
                <div class="flex flex-col">
                    <label class="text-xs font-medium text-muted mb-2">Minutes</label>
                    <div class="h-32 overflow-y-auto border border-border rounded bg-input scrollbar-thin">
                        @foreach($minuteOptions as $minute)
                            <button
                                type="button"
                                data-timepicker-minute="{{ $minute }}"
                                class="w-full px-3 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:bg-brand focus-visible:text-foreground-brand [&.selected]:bg-brand [&.selected]:text-foreground-brand transition-colors"
                            >
                                {{ sprintf('%02d', $minute) }}
                            </button>
                        @endforeach
                    </div>
                </div>

                {{-- Seconds (if enabled) --}}
                @if($showSeconds)
                    <div class="flex flex-col">
                        <label class="text-xs font-medium text-muted mb-2">Seconds</label>
                        <div class="h-32 overflow-y-auto border border-border rounded bg-input scrollbar-thin">
                            @foreach($secondOptions as $second)
                                <button
                                    type="button"
                                    data-timepicker-second="{{ $second }}"
                                    class="w-full px-3 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:bg-brand focus-visible:text-foreground-brand [&.selected]:bg-brand [&.selected]:text-foreground-brand transition-colors"
                                >
                                    {{ sprintf('%02d', $second) }}
                                </button>
                            @endforeach
                        </div>
                    </div>
                @endif

                {{-- Period (AM/PM for 12-hour format) - Always rendered, conditionally shown --}}
                <div class="flex flex-col" data-timepicker-period-section style="display: {{ $format === '12' ? 'block' : 'none' }}">
                    <label class="text-xs font-medium text-muted mb-2">Period</label>
                    <div class="space-y-1">
                        @foreach($periodOptions as $period)
                            <button
                                type="button"
                                data-timepicker-period="{{ $period }}"
                                class="w-full px-3 py-2 text-sm text-left border border-border rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:bg-brand focus-visible:text-foreground-brand [&.selected]:bg-brand [&.selected]:text-foreground-brand [&.selected]:border-brand transition-colors"
                            >
                                {{ $period }}
                            </button>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- Action buttons --}}
            <div class="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <x-keys::button
                    variant="outline"
                    size="sm"
                    data-timepicker-now
                >
                    Now
                </x-keys::button>
                <div class="flex items-center space-x-2">
                    <x-keys::button
                        variant="outline"
                        size="sm"
                        data-timepicker-cancel
                    >
                        Cancel
                    </x-keys::button>
                    <x-keys::button
                        variant="brand"
                        size="sm"
                        data-timepicker-apply
                    >
                        Apply
                    </x-keys::button>
                </div>
            </div>
        </div>
    </x-keys::popover>

    @if($isShorthand())
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    @endif
</div>