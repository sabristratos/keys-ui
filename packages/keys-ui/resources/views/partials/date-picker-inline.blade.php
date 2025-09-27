{{-- Date Picker Inline Input Partial --}}
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
           value="{{ $getFormattedValue() }}"
           placeholder="{{ $placeholder }}"
           class="{{ $inputClasses }}"
           data-date-picker-input
           @if($disabled) disabled @endif
           @if($readonly) readonly @endif
           @if($required) required @endif
           autocomplete="off">

    <div class="absolute inset-y-0 right-2 flex items-center gap-1">
        @if($clearable && $getFormattedValue())
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