{{-- Date Picker Trigger Button Partial --}}
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
                    @if($getFormattedValue())
                        {{ $getFormattedValue() }}
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
                    class="text-muted date-picker-icon transition-transform duration-200"
                />
            @elseif($iconRight)
                <x-keys::icon :name="$iconRight" :size="$iconSize" class="text-muted" data-icon />
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