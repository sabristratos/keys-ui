{{-- Calendar Content Partial - Shared between shorthand and non-shorthand modes --}}
<div {{ $containerAttributes }}>
    <!-- Calendar Header -->
    <div class="calendar-header flex items-center justify-between {{ $computedHeaderClasses }} border-b border-border">
        <x-keys::button
            variant="ghost"
            size="sm"
            data-calendar-nav="prev"
            :disabled="$disabled"
            class="calendar-nav-btn"
            icon-left="heroicon-o-chevron-left"
        >
            <span class="sr-only">Previous month</span>
        </x-keys::button>

        <div class="calendar-month-year-container relative">
            <x-keys::button
                variant="ghost"
                size="sm"
                data-calendar-month-year-btn
                :disabled="$disabled"
                class="calendar-month-year-btn font-semibold"
            >
                <span class="calendar-month-year-display">{{ $monthYearDisplay }}</span>
            </x-keys::button>

            <!-- Month Selection Dropdown -->
            <div class="calendar-month-dropdown absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 hidden"
                 data-calendar-month-dropdown>
                <div class="p-2 grid grid-cols-3 gap-1">
                    <!-- Month options will be populated by JavaScript -->
                </div>
            </div>

            <!-- Year Selection Dropdown -->
            <div class="calendar-year-dropdown absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 hidden max-h-64 overflow-y-auto"
                 data-calendar-year-dropdown>
                <div class="p-2 space-y-1">
                    <!-- Year options will be populated by JavaScript -->
                </div>
            </div>
        </div>

        <x-keys::button
            variant="ghost"
            size="sm"
            data-calendar-nav="next"
            :disabled="$disabled"
            class="calendar-nav-btn"
            icon-left="heroicon-o-chevron-right"
        >
            <span class="sr-only">Next month</span>
        </x-keys::button>
    </div>

    <!-- Calendar Grid Container -->
    <div class="calendar-grid-wrapper p-2" data-calendar-grid-wrapper>
        @if($monthsToShow > 1)
            <div class="calendar-multi-month-grid grid gap-2"
                 style="grid-template-columns: repeat({{ min($monthsToShow, 3) }}, 1fr);">
                @for($i = 0; $i < $monthsToShow; $i++)
                    <div class="calendar-grid" data-calendar-grid-container data-month-index="{{ $i }}">
                        <!-- Dynamic calendar grid will be populated by JavaScript -->
                    </div>
                @endfor
            </div>
        @else
            <div class="calendar-grid" data-calendar-grid-container>
                <!-- Dynamic calendar grid will be populated by JavaScript -->
            </div>
        @endif
    </div>

    <!-- Calendar Footer -->
    <div class="calendar-footer flex items-center justify-between p-2 border-t border-border">
        <x-keys::button
            variant="ghost"
            size="sm"
            data-calendar-action="clear"
            :disabled="$disabled"
            class="calendar-action-btn"
        >
            Clear
        </x-keys::button>

        <x-keys::button
            variant="ghost"
            size="sm"
            data-calendar-action="today"
            :disabled="$disabled"
            class="calendar-action-btn"
        >
            Today
        </x-keys::button>
    </div>

    <!-- Hidden Input for Form Submission -->
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
</div>
