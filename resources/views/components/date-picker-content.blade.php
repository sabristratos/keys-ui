{{-- Date Picker Input --}}
<div class="relative">
    @if($customTrigger)
        {{-- Custom trigger mode --}}
        <div class="custom-trigger" data-date-picker-trigger>
            {!! $customTrigger !!}
        </div>
        <input type="hidden"
               name="{{ $name }}"
               value="{{ $submitValue }}"
               class="date-picker-hidden-input"
               @if($required) required @endif
               {{ $wireAttributes }}>
    @else
        {{-- Standard input mode --}}
        @if($iconLeft)
            <x-keys::icon
                :name="$iconLeft"
                :size="$iconSize"
                class="icon-left"
            />
        @endif

        <input type="text"
               id="{{ $id }}"
               name="{{ $name }}_display"
               value="{{ $formattedValue }}"
               placeholder="{{ $placeholder }}"
               class="{{ $inputClasses }}"
               data-date-picker-input
               @if($disabled) disabled @endif
               @if($readonly || !$inline) readonly @endif
               @if($required) required @endif
               autocomplete="off">

        {{-- Actions container (clear + calendar buttons) following input-field pattern --}}
        <div class="absolute inset-y-0 right-2 flex items-center gap-1">
            @if($clearable && $formattedValue)
                <button type="button"
                        class="date-picker-clear flex items-center justify-center w-6 h-6 text-muted hover:text-danger focus:outline-none focus:text-danger transition-colors"
                        data-date-picker-clear
                        aria-label="Clear date"
                        @if($disabled) disabled @endif>
                    <x-keys::icon name="heroicon-o-x-mark" :size="$iconSize" />
                </button>
            @endif

            @if($showCalendarIcon && !$iconRight)
                <button type="button"
                        class="date-picker-trigger flex items-center justify-center w-8 h-8 text-muted hover:text-brand focus:outline-none focus:text-brand transition-colors"
                        data-date-picker-trigger
                        aria-label="Open calendar"
                        @if($disabled) disabled @endif>
                    <x-keys::icon name="heroicon-o-calendar" :size="$iconSize" />
                </button>
            @elseif($iconRight)
                <div class="flex items-center justify-center w-8 h-8 text-muted pointer-events-none">
                    <x-keys::icon :name="$iconRight" :size="$iconSize" />
                </div>
            @endif
        </div>

        {{-- Hidden input for actual form submission --}}
        <input type="hidden"
               name="{{ $name }}"
               value="{{ $submitValue }}"
               class="date-picker-hidden-input"
               data-date-picker-value>
    @endif
</div>

{{-- Calendar Dropdown --}}
<div class="date-picker-dropdown {{ $inline ? 'open' : '' }}" data-date-picker-dropdown>
    @if($quickSelectors && is_array($quickSelectors) && count($quickSelectors) > 0)
        <div class="quick-selectors">
            @foreach($quickSelectors as $selector)
                <button type="button"
                        class="quick-selector-btn"
                        data-quick-selector="{{ $selector['value'] }}"
                        @if(isset($selector['range']) && $selector['range'] && !$isRange) disabled @endif>
                    {{ $selector['label'] }}
                </button>
            @endforeach
        </div>
    @endif

    {{-- Embed the Calendar component --}}
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
        data-date-picker-calendar
    />
</div>

{{-- Error display --}}
@if($showErrors && $hasError())
    <x-keys::error :errors="$errors" />
@endif