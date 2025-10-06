@php
    $wireOnlyAttributes = $attributes->whereStartsWith('wire:');
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

    $datePickerAttributes = $attributes->whereDoesntStartWith('wire:')
        ->except(['class'])
        ->merge($dataAttributes)
        ->merge(['data-keys-date-picker-config' => json_encode($calendarData)]);

    $baseClasses = 'flex items-center shadow-xs justify-between gap-2.5 bg-input border border-line rounded-md transition-colors duration-200 cursor-pointer hover:border-neutral-300 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20';

    $sizeClasses = match ($size) {
        'sm' => 'min-h-[32px] text-sm',
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

    $hasErrorBool = $hasError();

    if ($disabled) {
        $stateClasses = 'opacity-50 cursor-not-allowed bg-elevation-1 text-muted';
    } elseif ($hasErrorBool) {
        $stateClasses = 'border-danger focus-within:border-danger focus-within:ring-danger/20 text-primary';
    } else {
        $stateClasses = 'text-primary';
    }
    $iconSize = match ($size) { 'sm' => 'xs', 'lg' => 'md', default => 'sm' };

    $triggerClasses = trim("$baseClasses $widthClasses $stateClasses");
    $overlayClasses = trim("$sizeClasses $paddingClasses");
    $inputClasses = "block w-full rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-1 px-3 py-2 $sizeClasses $stateClasses";
@endphp

@if($isShorthand)
    <div {{ $attributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1" {{ $datePickerAttributes }}>
            {{-- Hidden input for date picker value with Livewire support --}}
            <input type="hidden"
                   name="{{ $name }}"
                   value="{{ $getSubmitValue() }}"
                   data-date-picker-value
                   @if($required ?? false) required @endif
                   {{ $wireOnlyAttributes ?? collect() }}>

            @if(!$inline)
                <div wire:ignore>
                    <x-keys::popover
                    class="w-full"
                    :id="'date-picker-dropdown-' . $id"
                    placement="bottom-start"
                    :manual="false"
                >
                    <x-slot name="trigger">
                        <div class="relative">

                            @if($customTrigger)
                                <div class="cursor-pointer" data-date-picker-trigger>
                                    {!! $customTrigger !!}
                                </div>
                            @else

                                <button
                                    type="button"
                                    id="{{ $id }}"
                                    popovertarget="date-picker-dropdown-{{ $id }}"
                                    class="absolute inset-0 {{ $triggerClasses }}"
                                    data-popover-trigger="date-picker-dropdown-{{ $id }}"
                                    data-date-picker-trigger
                                    role="combobox"
                                    aria-expanded="false"
                                    aria-haspopup="dialog"
                                    {{ $disabled ? 'disabled aria-disabled=true' : '' }}
                                    {{ $required ? 'aria-required=true' : '' }}
                                >
                                    <span class="sr-only" data-date-picker-value>
                                        @if($formattedValue)
                                            {{ $formattedValue }}
                                        @else
                                            {{ $placeholder ?: __('keys-ui::keys-ui.datepicker.placeholder') }}
                                        @endif
                                    </span>
                                </button>


                                <div class="relative flex items-center justify-between pointer-events-none {{ $overlayClasses }}">

                                    <div class="flex items-center gap-2.5 flex-1 min-w-0">
                                        @if($iconLeft)
                                            <div class="text-muted pointer-events-none">
                                                <x-keys::icon :name="$iconLeft" :size="$iconSize" />
                                            </div>
                                        @endif


                                        <span class="date-picker-value truncate pointer-events-none text-primary" data-date-picker-display>
                                            @if($formattedValue)
                                                {{ $formattedValue }}
                                            @else
                                                <span class="text-muted">{{ $placeholder ?: __('keys-ui::keys-ui.datepicker.placeholder') }}</span>
                                            @endif
                                        </span>
                                    </div>


                                    <div class="flex items-center gap-2.5">
                                        @if($clearable && !$disabled)
                                            <x-keys::button
                                                type="button"
                                                variant="ghost"
                                                size="xs"
                                                class="opacity-0 pointer-events-auto transition-opacity duration-150"
                                                data-date-picker-clear
                                                aria-label="Clear date"
                                            >
                                                <x-keys::icon name="heroicon-o-x-mark" size="xs" />
                                            </x-keys::button>
                                        @endif

                                        @if($showCalendarIcon && !$iconRight)
                                            <div class="text-muted pointer-events-none">
                                                <x-keys::icon
                                                    name="heroicon-o-calendar"
                                                    :size="$iconSize"
                                                    class="date-picker-icon transition-transform duration-200"
                                                />
                                            </div>
                                        @elseif($iconRight)
                                            <div class="text-muted pointer-events-none">
                                                <x-keys::icon :name="$iconRight" :size="$iconSize" />
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            @endif
                        </div>
                    </x-slot>

                    <div class="w-auto min-w-full max-w-lg">
                        <x-keys::calendar
                            :value="$value"
                            :minDate="$minDate"
                            :maxDate="$maxDate"
                            :disabledDates="$disabledDates"
                            :size="$size"
                            :disabled="$disabled"
                            :isRange="$isRange"
                            :startDate="$startDate"
                            :endDate="$endDate"
                            :monthsToShow="$monthsToShow"
                            :quickSelectors="$quickSelectorsData"
                            data-date-picker-calendar="true"
                        />
                    </div>
                </x-keys::popover>
                </div>
            @else

                <div class="relative">
                    @if($iconLeft)
                        <x-keys::icon
                            :name="$iconLeft"
                            :size="$iconSize"
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                            data-icon
                        />
                    @endif

                    <input type="text"
                           id="{{ $id }}"
                           name="{{ $name }}_display"
                           value="{{ $formattedValue }}"
                           placeholder="{{ $placeholder }}"
                           class="{{ $inputClasses }} @if($iconLeft) pl-10 @endif @if($iconRight || $clearable || $showCalendarIcon) pr-14 @endif"
                           data-date-picker-input
                           @if($disabled) disabled @endif
                           @if($readonly) readonly @endif
                           @if($required) required @endif
                           autocomplete="off">

                    <div class="absolute inset-y-0 right-2 flex items-center gap-1">
                        @if($clearable && $formattedValue)
                            <x-keys::button
                                variant="ghost"
                                size="xs"
                                icon="heroicon-o-x-mark"
                                class="text-muted hover:text-danger"
                                data-date-picker-clear
                                aria-label="Clear date"
                                :disabled="$disabled"
                            />
                        @endif

                        @if($showCalendarIcon && !$iconRight)
                            <x-keys::button
                                variant="ghost"
                                size="xs"
                                icon="heroicon-o-calendar"
                                class="text-muted hover:text-accent"
                                data-date-picker-trigger
                                aria-label="Open calendar"
                                :disabled="$disabled"
                            />
                        @elseif($iconRight)
                            <div class="flex items-center justify-center w-8 h-8 text-muted pointer-events-none">
                                <x-keys::icon :name="$iconRight" :size="$iconSize" data-icon />
                            </div>
                        @endif
                    </div>
                </div>

                <div class="mt-2">
                    <x-keys::calendar
                        :value="$value"
                        :minDate="$minDate"
                        :maxDate="$maxDate"
                        :disabledDates="$disabledDates"
                        :size="$size"
                        :disabled="$disabled"
                        :isRange="$isRange"
                        :startDate="$startDate"
                        :endDate="$endDate"
                        :monthsToShow="$monthsToShow"
                        :quickSelectors="$quickSelectorsData"
                        data-date-picker-calendar="true"
                    />
                </div>
            @endif
        </div>

        @if($showErrors && $hasErrorBool)
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $attributes->only('class') }} {{ $datePickerAttributes }}>
        {{-- Hidden input for date picker value with Livewire support --}}
        <input type="hidden"
               name="{{ $name }}"
               value="{{ $getSubmitValue() }}"
               data-date-picker-value
               @if($required ?? false) required @endif
               {{ $wireOnlyAttributes ?? collect() }}>

        @if(!$inline)
            <div wire:ignore>
                <x-keys::popover
                class="w-full"
                :id="'date-picker-dropdown-' . $id"
                placement="bottom-start"
                :manual="false"
            >
                <x-slot name="trigger">
                    <div class="relative">

                        @if($customTrigger)
                            <div class="cursor-pointer" data-date-picker-trigger>
                                {!! $customTrigger !!}
                            </div>
                        @else
                            <button
                                type="button"
                                id="{{ $id }}"
                                popovertarget="date-picker-dropdown-{{ $id }}"
                                class="absolute inset-0 {{ $triggerClasses }}"
                                data-popover-trigger="date-picker-dropdown-{{ $id }}"
                                data-date-picker-trigger
                                role="combobox"
                                aria-expanded="false"
                                aria-haspopup="dialog"
                                {{ $disabled ? 'disabled aria-disabled=true' : '' }}
                                {{ $required ? 'aria-required=true' : '' }}
                            >
                                <span class="sr-only" data-date-picker-value>
                                    @if($formattedValue)
                                        {{ $formattedValue }}
                                    @else
                                        {{ $placeholder ?: __('keys-ui::keys-ui.datepicker.placeholder') }}
                                    @endif
                                </span>
                            </button>

                            {{-- Visual overlay --}}
                            <div class="relative flex items-center justify-between pointer-events-none {{ $overlayClasses }}">
                                {{-- Left side: Icon + Value --}}
                                <div class="flex items-center gap-2.5 flex-1 min-w-0">
                                    @if($iconLeft)
                                        <div class="text-muted pointer-events-none">
                                            <x-keys::icon :name="$iconLeft" :size="$iconSize" />
                                        </div>
                                    @endif

                                    <span class="date-picker-value truncate pointer-events-none text-primary" data-date-picker-display>
                                        @if($formattedValue)
                                            {{ $formattedValue }}
                                        @else
                                            <span class="text-muted">{{ $placeholder ?: __('keys-ui::keys-ui.datepicker.placeholder') }}</span>
                                        @endif
                                    </span>
                                </div>

                                {{-- Right side: Clear + Calendar Icon --}}
                                <div class="flex items-center gap-2.5">
                                    @if($clearable && !$disabled)
                                        <x-keys::button
                                            type="button"
                                            variant="ghost"
                                            size="xs"
                                            class="opacity-0 pointer-events-auto transition-opacity duration-150"
                                            data-date-picker-clear
                                            aria-label="Clear date"
                                        >
                                            <x-keys::icon name="heroicon-o-x-mark" size="xs" />
                                        </x-keys::button>
                                    @endif

                                    @if($showCalendarIcon && !$iconRight)
                                        <div class="text-muted pointer-events-none">
                                            <x-keys::icon
                                                name="heroicon-o-calendar"
                                                :size="$iconSize"
                                                class="date-picker-icon transition-transform duration-200"
                                            />
                                        </div>
                                    @elseif($iconRight)
                                        <div class="text-muted pointer-events-none">
                                            <x-keys::icon :name="$iconRight" :size="$iconSize" />
                                        </div>
                                    @endif
                                </div>
                            </div>
                        @endif
                    </div>
                </x-slot>

                <div class="w-auto min-w-full max-w-lg">
                    <x-keys::calendar
                        :value="$value"
                        :minDate="$minDate"
                        :maxDate="$maxDate"
                        :disabledDates="$disabledDates"
                        :size="$size"
                        :disabled="$disabled"
                        :isRange="$isRange"
                        :startDate="$startDate"
                        :endDate="$endDate"
                        :monthsToShow="$monthsToShow"
                        :quickSelectors="$quickSelectorsData"
                        data-date-picker-calendar="true"
                    />
                </div>
            </x-keys::popover>
            </div>
        @else

            <div class="relative">
                @if($iconLeft)
                    <x-keys::icon
                        :name="$iconLeft"
                        :size="$iconSize"
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                        data-icon
                    />
                @endif

                <input type="text"
                       id="{{ $id }}"
                       name="{{ $name }}_display"
                       value="{{ $formattedValue }}"
                       placeholder="{{ $placeholder }}"
                       class="{{ $inputClasses }} @if($iconLeft) pl-10 @endif @if($iconRight || $clearable || $showCalendarIcon) pr-14 @endif"
                       data-date-picker-input
                       @if($disabled) disabled @endif
                       @if($readonly) readonly @endif
                       @if($required) required @endif
                       autocomplete="off">

                <div class="absolute inset-y-0 right-2 flex items-center gap-1">
                    @if($clearable && $formattedValue)
                        <x-keys::button
                            variant="ghost"
                            size="xs"
                            icon="heroicon-o-x-mark"
                            class="text-muted hover:text-danger"
                            data-date-picker-clear
                            aria-label="Clear date"
                            :disabled="$disabled"
                        />
                    @endif

                    @if($showCalendarIcon && !$iconRight)
                        <x-keys::button
                            variant="ghost"
                            size="xs"
                            icon="heroicon-o-calendar"
                            class="text-muted hover:text-accent"
                            data-date-picker-trigger
                            aria-label="Open calendar"
                            :disabled="$disabled"
                        />
                    @elseif($iconRight)
                        <div class="flex items-center justify-center w-8 h-8 text-muted pointer-events-none">
                            <x-keys::icon :name="$iconRight" :size="$iconSize" data-icon />
                        </div>
                    @endif
                </div>
            </div>

            <div class="mt-2">
                <x-keys::calendar
                    :value="$value"
                    :minDate="$minDate"
                    :maxDate="$maxDate"
                    :disabledDates="$disabledDates"
                    :size="$size"
                    :disabled="$disabled"
                    :isRange="$isRange"
                    :startDate="$startDate"
                    :endDate="$endDate"
                    :monthsToShow="$monthsToShow"
                    :quickSelectors="$quickSelectorsData"
                    data-date-picker-calendar="true"
                />
            </div>
        @endif

        @if($showErrors && $hasErrorBool)
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@endif
