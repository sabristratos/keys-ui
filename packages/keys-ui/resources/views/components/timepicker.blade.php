@php

    $wireOnlyAttributes = $attributes->whereStartsWith('wire:');
    $nonWireAttributes = $attributes->whereDoesntStartWith('wire:');
    $isLivewireEnabled = $wireOnlyAttributes->isNotEmpty();

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

    $timePickerAttributes = $nonWireAttributes
        ->except(['class'])
        ->merge($dataAttributes);

    $baseClasses = 'input-trigger-base cursor-pointer';

    $sizeClasses = match ($size) {
        'sm' => 'min-h-[32px] px-3 py-1.5 text-sm',
        'md' => 'min-h-[38px] px-3 py-2 text-sm',
        'lg' => 'min-h-[42px] px-4 py-2.5 text-base',
        default => 'min-h-[38px] px-3 py-2 text-sm'
    };

    if ($disabled) {
        $stateClasses = 'input-disabled text-muted';
    } elseif ($hasError()) {
        $stateClasses = 'input-error text-foreground';
    } else {
        $stateClasses = 'input-default text-foreground';
    }

    $iconSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    $rightPadding = match ($size) {
        'sm' => 'pr-3',
        'md' => 'pr-4',
        'lg' => 'pr-5',
        default => 'pr-4'
    };

    $triggerClasses = "$baseClasses $sizeClasses $stateClasses $rightPadding";

    $dropdownWidthClasses = 'w-auto min-w-full max-w-md';
@endphp

<div {{ $attributes->only('class') }} @if(!$isShorthand()) {{ $timePickerAttributes }} @endif>
    @if($isShorthand())
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1" {{ $timePickerAttributes }}>
    @endif

    
    <input type="hidden" name="{{ $name }}" value="{{ $value }}" data-timepicker-hidden-input>

    
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
                    <span class="sr-only" data-timepicker-value>
                        @if($value)
                            {{ $value }}
                        @else
                            {{ $placeholder ?: 'Select time...' }}
                        @endif
                    </span>
                </button>

                
                <div class="absolute inset-0 flex items-center justify-between pointer-events-none px-3 py-2">
                    
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                        

                        
                        <span class="timepicker-value truncate pointer-events-none" data-timepicker-display>
                            @if($value)
                                {{ $value }}
                            @else
                                <span class="text-muted">{{ $placeholder ?: 'Select time...' }}</span>
                            @endif
                        </span>
                    </div>

                    
                    <div class="flex items-center gap-2">
                        @if($clearable && !$disabled)
                            <x-keys::button
                                type="button"
                                variant="ghost"
                                size="xs"
                                class="opacity-0 pointer-events-auto transition-opacity duration-150"
                                data-timepicker-clear
                                aria-label="Clear time"
                            >
                                <x-keys::icon name="heroicon-o-x-mark" size="xs" />
                            </x-keys::button>
                        @endif

                        
                        <div class="text-muted pointer-events-none">
                            <x-keys::icon
                                name="heroicon-o-clock"
                                size="{{ $iconSize }}"
                                class="timepicker-icon transition-transform duration-200"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </x-slot>

        
        <div class="{{ $dropdownWidthClasses }}">
            
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

            
            <div class="grid gap-3" data-timepicker-grid
                 style="grid-template-columns: repeat({{ $showSeconds ? ($format === '12' ? '4' : '3') : ($format === '12' ? '3' : '2') }}, 1fr);">
                
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