

<div class="calendar-header flex items-center justify-between px-4 py-3 border-b border-border">
    <x-keys::button
        variant="ghost"
        size="sm"
        data-calendar-nav="prev"
        :disabled="$disabled"
        icon-left="heroicon-o-chevron-left"
    >
        <span class="sr-only">{{ __('keys-ui::keys-ui.calendar.previous_month') }}</span>
    </x-keys::button>

    <div class="calendar-month-year-container relative">
        <x-keys::button
            variant="ghost"
            size="sm"
            data-calendar-month-year-btn
            :disabled="$disabled"
        >
            <span class="calendar-month-year-display">{{ $monthYearDisplay }}</span>
        </x-keys::button>
    </div>

    <x-keys::button
        variant="ghost"
        size="sm"
        data-calendar-nav="next"
        :disabled="$disabled"
        icon-left="heroicon-o-chevron-right"
    >
        <span class="sr-only">{{ __('keys-ui::keys-ui.calendar.next_month') }}</span>
    </x-keys::button>
</div>

<div class="calendar-main-content flex flex-col md:flex-row gap-4" data-calendar-main-content>

    @if(isset($quickSelectors) && is_array($quickSelectors) && count($quickSelectors) > 0)
        <div class="calendar-quick-selectors md:w-max flex-shrink-0 order-first p-2" data-view-mode-show="calendar">
            <div class="text-xs font-medium text-muted mb-2">{{ __('keys-ui::keys-ui.datepicker.quick_select_label') }}</div>
            <div class="flex flex-wrap md:flex-col gap-1">
                @foreach($quickSelectors as $selector)
                    <x-keys::button
                        variant="ghost"
                        size="xs"
                        data-quick-selector="{{ $selector['value'] }}"
                        :title="$selector['description'] ?? $selector['label']"
                        aria-label="{{ $selector['description'] ?? $selector['label'] }}"
                    >
                        {{ $selector['label'] }}
                    </x-keys::button>
                @endforeach
            </div>
        </div>
    @endif


    <div class="calendar-grid-wrapper flex-1 py-2" data-calendar-grid-wrapper>
        @if($monthsToShow > 1)
            <div class="calendar-multi-month-grid grid gap-8"
                 style="grid-template-columns: repeat({{ min($monthsToShow, 3) }}, 1fr);">
                @for($i = 0; $i < $monthsToShow; $i++)
                    <div class="calendar-grid" data-calendar-grid-container data-month-index="{{ $i }}">

                    </div>
                @endfor
            </div>
        @else
            <div class="calendar-grid" data-calendar-grid-container>

            </div>
        @endif
    </div>
</div>

<div class="calendar-footer flex items-center justify-between px-4 py-3 border-t border-border">
    <div class="flex items-center gap-2">
        <x-keys::button
            variant="ghost"
            color="danger"
            size="sm"
            data-calendar-action="clear"
            :disabled="$disabled"
            title="Clear selected {{ $isRange ? 'date range' : 'date' }}"
            icon-left="heroicon-o-trash"
        >
{{ $isRange ? __('keys-ui::keys-ui.datepicker.clear_range') : __('keys-ui::keys-ui.datepicker.clear') }}
        </x-keys::button>
    </div>

    <div class="flex items-center gap-2">
        <x-keys::button
            variant="ghost"
            color="primary"
            size="sm"
            data-calendar-action="today"
            :disabled="$disabled"
            title="Select today's date"
            icon-left="heroicon-o-map-pin"
        >
{{ __('keys-ui::keys-ui.datepicker.go_to_today') }}
        </x-keys::button>
    </div>
</div>

@if($name)
    @if($isRange)
        <input type="hidden"
               name="{{ $name }}_start"
               value="{{ $startDate instanceof \Carbon\Carbon ? $startDate->format('Y-m-d') : '' }}"
               class="calendar-hidden-input calendar-start-input"
               @if($required) required @endif>
        <input type="hidden"
               name="{{ $name }}_end"
               value="{{ $endDate instanceof \Carbon\Carbon ? $endDate->format('Y-m-d') : '' }}"
               class="calendar-hidden-input calendar-end-input"
               @if($required) required @endif
               {{ $wireAttributes }}>
        <input type="hidden"
               name="{{ $name }}"
               value="{{ $formattedValue }}"
               class="calendar-hidden-input calendar-range-input">
    @else
        <input type="hidden"
               name="{{ $name }}"
               value="{{ $formattedValue }}"
               class="calendar-hidden-input"
               @if($required) required @endif
               {{ $wireAttributes }}>
    @endif
@endif
