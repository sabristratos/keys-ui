@php

    $wireOnlyAttributes = $attributes->whereStartsWith('wire:');
    $nonWireAttributes = $attributes->whereDoesntStartWith('wire:');
    $isLivewireEnabled = $wireOnlyAttributes->isNotEmpty();

    if ($isLivewireEnabled) {
        $dataAttributes = array_merge($dataAttributes, [
            'data-livewire-enabled' => 'true',
            'data-livewire-mode' => 'true',
        ]);

        $wireModel = $wireOnlyAttributes->whereStartsWith('wire:model')->first();
        if ($wireModel) {
            $dataAttributes['data-wire-model'] = $wireModel;
            $dataAttributes['data-livewire-property'] = $wireModel;
        }
    }

    $shorthandSpacing = ($isShorthand() && $label) ? ' mt-1' : '';

    // Wrapper gets all visual styling for group selector targeting
    $wrapperVisualClasses = 'relative bg-input border border-line rounded-md transition-colors duration-200 hover:border-neutral-300 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20';

    // Button is just transparent click overlay
    $buttonClasses = 'absolute inset-0 cursor-pointer';

    $sizeClasses = match ($size) {
        'sm' => 'min-h-[32px] text-sm',
        'md' => 'min-h-[38px] text-sm',
        'lg' => 'min-h-[42px] text-base',
        default => 'min-h-[38px] text-sm'
    };

    $paddingClasses = match ($size) {
        'sm' => 'px-3 py-1.5',
        'md' => 'px-3 py-2',
        'lg' => 'px-4 py-2.5',
        default => 'px-3 py-2'
    };

    $widthClasses = match ($width) {
        'auto' => 'w-auto',
        'xs' => 'w-20',
        'sm' => 'w-32',
        'md' => 'w-48',
        'lg' => 'w-64',
        'xl' => 'w-80',
        '2xl' => 'w-96',
        'fit' => 'w-fit',
        'full' => 'w-full',
        default => 'w-full'
    };

    if ($disabled) {
        $stateClasses = 'opacity-50 cursor-not-allowed bg-elevation-1 text-muted';
    } elseif ($hasError()) {
        $stateClasses = 'border-danger focus-within:border-danger focus-within:ring-danger/20 text-primary';
    } else {
        $stateClasses = 'text-primary';
    }

    $iconSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    $timePickerAttributes = $nonWireAttributes
        ->except(['class'])
        ->merge(array_merge($dataAttributes, [
            'class' => trim("$wrapperVisualClasses $widthClasses $stateClasses$shorthandSpacing")
        ]));

    $overlayClasses = trim("$sizeClasses $paddingClasses");

    $dropdownWidthClasses = 'w-auto min-w-full max-w-md';

    // Calculate grid columns in Blade instead of JS
    $gridColumns = 2; // Default: hours + minutes
    if ($showSeconds) $gridColumns++;
    if ($format === '12') $gridColumns++;
    $gridClasses = "grid gap-3 grid-cols-{$gridColumns}";

    // Period section visibility classes
    $periodSectionClasses = $format === '12' ? 'flex flex-col' : 'hidden';
@endphp

<div {{ $attributes->only('class') }} @if(!$isShorthand()) {{ $timePickerAttributes }} @endif>
    @if($isShorthand())
        @if($label)
            <x-keys::label :for="$id" :required="$required" :optional="$optional">
                {{ $label }}
            </x-keys::label>
        @endif

        <div {{ $timePickerAttributes }}>
    @endif


    <input type="hidden" name="{{ $name }}" value="{{ $value }}" data-timepicker-hidden-input {{ $wireOnlyAttributes }}>


    <div wire:ignore>
        <x-keys::popover
        :id="'timepicker-dropdown-' . $id"
        placement="bottom-start"
        :manual="false"
    >
        <x-slot name="trigger">
            <div class="relative">

                <button
                    type="button"
                    id="{{ $id }}"
                    popovertarget="timepicker-dropdown-{{ $id }}"
                    class="{{ $buttonClasses }}"
                    data-popover-trigger="timepicker-dropdown-{{ $id }}"
                    data-timepicker-trigger
                    role="combobox"
                    aria-expanded="false"
                    aria-haspopup="dialog"
                    {{ $disabled ? 'disabled aria-disabled=true' : '' }}
                    {{ $required ? 'aria-required=true' : '' }}
                >
                    <span class="sr-only" data-timepicker-value>
                        @if($value)
                            {{ $value }}
                        @else
                            {{ $placeholder ?: __('keys-ui::keys-ui.timepicker.placeholder') }}
                        @endif
                    </span>
                </button>


                <div class="relative flex items-center justify-between pointer-events-none {{ $overlayClasses }}">

                    <div class="flex items-center gap-2.5 flex-1 min-w-0">


                        <span class="timepicker-value truncate pointer-events-none text-primary" data-timepicker-display>
                            @if($value)
                                {{ $value }}
                            @else
                                <span class="text-muted">{{ $placeholder ?: __('keys-ui::keys-ui.timepicker.placeholder') }}</span>
                            @endif
                        </span>
                    </div>


                    <div class="flex items-center gap-2.5">
                        @if($clearable && !$disabled)
                            <x-keys::button
                                type="button"
                                variant="ghost"
                                size="xs"
                                class="transition-opacity duration-150"
                                :class="$value ? '' : 'invisible'"
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
                <div class="flex items-center justify-between px-4 py-3 mb-3 border-b border-line">
                    <span class="text-sm font-medium text-primary">{{ __('keys-ui::keys-ui.timepicker.time_format') }}</span>
                    <x-keys::group :attached="true">
                        <x-keys::button
                            size="xs"
                            :variant="$format === '24' ? 'solid' : 'outline'"
                            data-timepicker-format="24"
                            :data-selected="$format === '24' ? 'true' : 'false'"
                            aria-pressed="{{ $format === '24' ? 'true' : 'false' }}"
                        >
{{ __('keys-ui::keys-ui.timepicker.format_24h') }}
                        </x-keys::button>
                        <x-keys::button
                            size="xs"
                            :variant="$format === '12' ? 'solid' : 'outline'"
                            data-timepicker-format="12"
                            :data-selected="$format === '12' ? 'true' : 'false'"
                            aria-pressed="{{ $format === '12' ? 'true' : 'false' }}"
                        >
{{ __('keys-ui::keys-ui.timepicker.format_12h') }}
                        </x-keys::button>
                    </x-keys::group>
                </div>
            @endif

            {{-- Quick Time Presets --}}
            <div class="mb-3">
                <label class="text-xs font-medium text-muted mb-2 block">{{ __('keys-ui::keys-ui.timepicker.quick_select') }}</label>
                <div class="flex flex-wrap gap-2">
                    @foreach($timePresets as $preset)
                        <x-keys::button
                            type="button"
                            variant="outline"
                            size="xs"
                            data-timepicker-preset="{{ $preset['time'] }}"
                        >
                            {{ $preset['label'] }}
                        </x-keys::button>
                    @endforeach
                </div>
            </div>

            <div class="{{ $gridClasses }}" data-timepicker-grid>

                <div class="flex flex-col">
                    <label class="text-xs font-medium text-muted mb-2">{{ $format === '12' ? __('keys-ui::keys-ui.timepicker.hour') : __('keys-ui::keys-ui.timepicker.hours') }}</label>
                    <div
                        class="h-32 overflow-y-auto border border-line rounded bg-elevation-1 scrollbar-thin py-1"
                        data-timepicker-hours
                        role="listbox"
                        aria-label="Select hour"
                    >
                        @foreach($hourOptions as $hour)
                            <button
                                type="button"
                                data-timepicker-hour="{{ $hour }}"
                                class="w-full px-3 py-2 text-sm text-primary text-left hover:bg-hover focus-visible:bg-accent focus-visible:text-accent-foreground [&.selected]:bg-accent [&.selected]:text-white [&.selected]:font-medium transition-colors"
                                role="option"
                                aria-selected="false"
                            >
                                {{ sprintf('%02d', $hour) }}
                            </button>
                        @endforeach
                    </div>
                </div>


                <div class="flex flex-col">
                    <div class="flex items-center justify-between mb-2">
                        <label class="text-xs font-medium text-muted">{{ __('keys-ui::keys-ui.timepicker.minutes') }}</label>
                        @if($step > 1)
                            <span class="text-xs text-muted">{{ $step }} min</span>
                        @endif
                    </div>
                    <div
                        class="h-32 overflow-y-auto border border-line rounded bg-input scrollbar-thin py-1"
                        role="listbox"
                        aria-label="Select minutes"
                    >
                        @foreach($minuteOptions as $minute)
                            <button
                                type="button"
                                data-timepicker-minute="{{ $minute }}"
                                class="w-full px-3 py-2 text-sm text-primary text-left hover:bg-hover focus-visible:bg-accent focus-visible:text-accent-foreground [&.selected]:bg-accent [&.selected]:text-white [&.selected]:font-medium transition-colors"
                                role="option"
                                aria-selected="false"
                            >
                                {{ sprintf('%02d', $minute) }}
                            </button>
                        @endforeach
                    </div>
                </div>


                @if($showSeconds)
                    <div class="flex flex-col">
                        <label class="text-xs font-medium text-muted mb-2">{{ __('keys-ui::keys-ui.timepicker.seconds') }}</label>
                        <div
                            class="h-32 overflow-y-auto border border-line rounded bg-input scrollbar-thin py-1"
                            role="listbox"
                            aria-label="Select seconds"
                        >
                            @foreach($secondOptions as $second)
                                <button
                                    type="button"
                                    data-timepicker-second="{{ $second }}"
                                    class="w-full px-3 py-2 text-sm text-primary text-left hover:bg-hover focus-visible:bg-accent focus-visible:text-accent-foreground [&.selected]:bg-accent [&.selected]:text-white [&.selected]:font-medium transition-colors"
                                    role="option"
                                    aria-selected="false"
                                >
                                    {{ sprintf('%02d', $second) }}
                                </button>
                            @endforeach
                        </div>
                    </div>
                @endif


                <div class="{{ $periodSectionClasses }}" data-timepicker-period-section>
                    <label class="text-xs font-medium text-muted mb-2">{{ __('keys-ui::keys-ui.timepicker.period') }}</label>
                    <div class="space-y-1" role="radiogroup" aria-label="Select AM or PM">
                        @foreach($periodOptions as $period)
                            <x-keys::button
                                type="button"
                                variant="outline"
                                size="sm"
                                class="w-full justify-start [&.selected]:bg-accent [&.selected]:text-white [&.selected]:border-accent"
                                data-timepicker-period="{{ $period }}"
                                role="radio"
                                aria-checked="false"
                            >
                                {{ $period }}
                            </x-keys::button>
                        @endforeach
                    </div>
                </div>
            </div>


            <div class="flex items-center justify-between px-4 py-3 mt-3 border-t border-line">
                <x-keys::button
                    variant="outline"
                    size="sm"
                    data-timepicker-now
                >
{{ __('keys-ui::keys-ui.timepicker.now') }}
                </x-keys::button>
                <div class="flex items-center space-x-2">
                    <x-keys::button
                        variant="outline"
                        size="sm"
                        data-timepicker-cancel
                    >
{{ __('keys-ui::keys-ui.timepicker.cancel') }}
                    </x-keys::button>
                    <x-keys::button
                        variant="solid"
                        size="sm"
                        data-timepicker-apply
                    >
{{ __('keys-ui::keys-ui.timepicker.apply') }}
                    </x-keys::button>
                </div>
            </div>
        </div>
    </x-keys::popover>
    </div>

    @if($isShorthand())
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    @endif
</div>
