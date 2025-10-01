
@if(!$inline)
    
    <x-keys::popover
        class="w-full"
        :id="'date-picker-dropdown-' . $id"
        placement="bottom-start"
        :manual="false"
    >
        <x-slot name="trigger">
            <div class="relative">
                @include('keys::partials.date-picker-trigger')
            </div>
        </x-slot>

        <div class="{{ $dropdownWidthClasses }}">
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
                :quickSelectors="$quickSelectors"
                data-date-picker-calendar="true"
            />
        </div>
    </x-keys::popover>
@else
    
    @include('keys::partials.date-picker-inline')

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
            :quickSelectors="$quickSelectors"
            data-date-picker-calendar="true"
        />
    </div>
@endif