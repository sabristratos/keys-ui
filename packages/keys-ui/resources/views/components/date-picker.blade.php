@php
    $wireOnlyAttributes = $attributes->whereStartsWith('wire:');
    $isLivewireEnabled = $wireOnlyAttributes->isNotEmpty();

    if ($isLivewireEnabled) {
        $dataAttributes = array_merge($dataAttributes, ['data-livewire-enabled' => 'true']);
        $wireModel = $wireOnlyAttributes->whereStartsWith('wire:model')->first();
        if ($wireModel) $dataAttributes['data-wire-model'] = $wireModel;
    }

    $datePickerAttributes = $attributes->whereDoesntStartWith('wire:')
        ->except(['class'])
        ->merge($dataAttributes)
        ->merge(['data-keys-date-picker-config' => json_encode($calendarData)]);

    $baseClasses = 'input-trigger-base';

    $sizeClasses = match ($size) {
        'sm' => 'min-h-[32px] px-3 py-1.5 text-sm',
        'lg' => 'min-h-[42px] px-4 py-2.5 text-base',
        default => 'min-h-[38px] px-3 py-2 text-sm'
    };

    $hasErrorBool = $hasError();

    if ($disabled) {
        $stateClasses = 'input-disabled text-muted';
    } elseif ($hasErrorBool) {
        $stateClasses = 'input-error';
    } else {
        $stateClasses = 'input-default cursor-pointer';
    }
    $iconSize = match ($size) { 'sm' => 'xs', 'lg' => 'md', default => 'sm' };

    $triggerClasses = "$baseClasses $sizeClasses $stateClasses";
    $inputClasses = "block w-full rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-1 $sizeClasses $stateClasses";
@endphp

@if($isShorthand)
    <div {{ $attributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1" {{ $datePickerAttributes }}>
            
            @if(!$inline)
                
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
                                <input type="hidden"
                                       name="{{ $name }}"
                                       value="{{ $submitValue }}"
                                       @if($required) required @endif
                                       {{ $wireOnlyAttributes }}>
                            @else
                                
                                <button
                                    type="button"
                                    id="{{ $id }}"
                                    class="{{ $triggerClasses }}"
                                    data-popover-trigger="date-picker-dropdown-{{ $id }}"
                                    data-date-picker-trigger
                                    role="combobox"
                                    aria-expanded="false"
                                    aria-haspopup="dialog"
                                    {{ $disabled ? 'disabled aria-disabled=true' : '' }}
                                    {{ $required ? 'aria-required=true' : '' }}
                                    {{ $wireOnlyAttributes }}
                                >
                                    <span class="sr-only" data-date-picker-value>
                                        @if($formattedValue)
                                            {{ $formattedValue }}
                                        @else
                                            {{ $placeholder ?: 'Select date...' }}
                                        @endif
                                    </span>
                                </button>

                                
                                <div class="absolute inset-0 flex items-center justify-between pointer-events-none px-3 py-2">
                                    
                                    <div class="flex items-center gap-2 flex-1 min-w-0">
                                        @if($iconLeft)
                                            <div class="text-muted pointer-events-none">
                                                <x-keys::icon :name="$iconLeft" :size="$iconSize" />
                                            </div>
                                        @endif

                                        
                                        <span class="date-picker-value truncate pointer-events-none" data-date-picker-display>
                                            @if($formattedValue)
                                                {{ $formattedValue }}
                                            @else
                                                <span class="text-muted">{{ $placeholder ?: 'Select date...' }}</span>
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

                                <input type="hidden"
                                       name="{{ $name }}"
                                       value="{{ $submitValue }}"
                                       data-date-picker-value>
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
                                class="text-muted hover:text-brand"
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

                    <input type="hidden"
                           name="{{ $name }}"
                           value="{{ $submitValue }}"
                           data-date-picker-value>
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
        
        @if(!$inline)
            
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
                            <input type="hidden"
                                   name="{{ $name }}"
                                   value="{{ $submitValue }}"
                                   @if($required) required @endif
                                   {{ $wireOnlyAttributes }}>
                        @else
                            <button
                                type="button"
                                id="{{ $id }}"
                                class="{{ $triggerClasses }}"
                                data-popover-trigger="date-picker-dropdown-{{ $id }}"
                                data-date-picker-trigger
                                role="combobox"
                                aria-expanded="false"
                                aria-haspopup="dialog"
                                {{ $disabled ? 'disabled aria-disabled=true' : '' }}
                                {{ $required ? 'aria-required=true' : '' }}
                                {{ $wireOnlyAttributes }}
                            >
                                <div class="flex items-center flex-1 min-w-0">
                                    @if($iconLeft)
                                        <x-keys::icon
                                            :name="$iconLeft"
                                            :size="$iconSize"
                                            class="mr-2 text-muted"
                                            data-icon
                                        />
                                    @endif

                                    <div class="date-picker-display flex justify-start flex-1">
                                        <span class="date-picker-value truncate" data-date-picker-display>
                                            @if($formattedValue)
                                                {{ $formattedValue }}
                                            @else
                                                <span class="text-muted date-picker-placeholder">{{ $placeholder ?: 'Select date...' }}</span>
                                            @endif
                                        </span>
                                    </div>
                                </div>

                                <div class="flex items-center">
                                    @if($showCalendarIcon && !$iconRight)
                                        <x-keys::icon
                                            name="heroicon-o-calendar"
                                            :size="$iconSize"
                                            class="date-picker-icon transition-transform duration-200"
                                        />
                                    @elseif($iconRight)
                                        <x-keys::icon :name="$iconRight" :size="$iconSize" data-icon />
                                    @endif
                                </div>
                            </button>

                            @if($clearable && !$disabled)
                                <div class="absolute inset-0 flex justify-between items-center pointer-events-none px-3 py-2">
                                    <div class="flex-1"></div>
                                    <x-keys::button
                                        type="button"
                                        variant="ghost"
                                        size="xs"
                                        class="opacity-0 pointer-events-none transition-opacity duration-150 text-muted hover:text-danger ml-auto mr-6"
                                        data-date-picker-clear
                                        aria-label="Clear date"
                                    >
                                        <x-keys::icon name="heroicon-o-x-mark" size="xs" />
                                    </x-keys::button>
                                </div>
                            @endif

                            <input type="hidden"
                                   name="{{ $name }}"
                                   value="{{ $submitValue }}"
                                   data-date-picker-value>
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
                            class="text-muted hover:text-brand"
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

                <input type="hidden"
                       name="{{ $name }}"
                       value="{{ $submitValue }}"
                       data-date-picker-value>
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