<?php

namespace Keys\UI\Components;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Calendar extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public mixed $value = null,
        public string|Carbon|null $minDate = null,
        public string|Carbon|null $maxDate = null,
        public array $disabledDates = [],
        public string $size = 'md',
        public bool $disabled = false,
        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $hasError = false,
        public ?Carbon $currentMonth = null,
        public bool $isRange = false,
        public mixed $startDate = null,
        public mixed $endDate = null,
        public int $monthsToShow = 1,
        public bool|array $quickSelectors = false
    ) {
        $this->initializeBasicProperties();
        $this->initializeDateValues();
        $this->initializeConstraints();
        $this->validateProperties();
        $this->initializeErrorState();
    }

    /**
     * Initialize basic component properties
     */
    private function initializeBasicProperties(): void
    {
        $this->id = $this->id ?? $this->name ?? 'calendar-'.uniqid();
        $this->currentMonth = $this->currentMonth ?? Carbon::now()->startOfMonth();

        // Validate monthsToShow
        if ($this->monthsToShow < 1 || $this->monthsToShow > 12) {
            $this->monthsToShow = 1;
        }
    }

    /**
     * Initialize and parse date values based on calendar mode
     */
    private function initializeDateValues(): void
    {
        if ($this->isRange) {
            $this->initializeRangeDateValues();
        } else {
            $this->initializeSingleDateValue();
        }
    }

    /**
     * Initialize date values for range mode
     */
    private function initializeRangeDateValues(): void
    {
        $this->value = null; // Don't use single value in range mode

        $this->startDate = $this->parseDate($this->startDate);
        $this->endDate = $this->parseDate($this->endDate);
    }

    /**
     * Initialize date value for single date mode
     */
    private function initializeSingleDateValue(): void
    {
        $this->value = $this->parseDate($this->value);

        // Clear range values in single date mode
        $this->startDate = null;
        $this->endDate = null;
    }

    /**
     * Parse a date value to Carbon instance or null
     *
     * This method handles multiple input types and provides safe date parsing:
     *
     * Supported Input Types:
     * - Carbon instance: Returns as-is
     * - Non-empty string: Attempts to parse with Carbon::parse()
     * - Empty/null values: Returns null
     * - Other types: Returns null
     *
     * Error Handling:
     * - Invalid date strings return null instead of throwing exceptions
     * - This ensures the calendar remains functional even with bad input data
     *
     * @param  mixed  $date  The date value to parse (string, Carbon, or other)
     * @return Carbon|null Parsed Carbon instance or null if parsing fails
     */
    private function parseDate(mixed $date): ?Carbon
    {
        // Handle null or falsy values
        if (! $date) {
            return null;
        }

        // Return Carbon instances as-is
        if ($date instanceof Carbon) {
            return $date;
        }

        // Attempt to parse string values
        if (is_string($date) && ! empty(trim($date))) {
            try {
                return Carbon::parse($date);
            } catch (\Exception $e) {
                // Return null for invalid date strings instead of throwing
                return null;
            }
        }

        // Return null for unsupported types
        return null;
    }

    /**
     * Initialize min/max date constraints
     */
    private function initializeConstraints(): void
    {
        // Parse min date with start of day
        if ($this->minDate) {
            $parsedMin = $this->parseDate($this->minDate);
            $this->minDate = $parsedMin?->startOfDay();
        }

        // Parse max date with end of day
        if ($this->maxDate) {
            $parsedMax = $this->parseDate($this->maxDate);
            $this->maxDate = $parsedMax?->endOfDay();
        }
    }

    /**
     * Validate component properties
     */
    private function validateProperties(): void
    {
        // Validate size
        if (! in_array($this->size, ComponentConstants::CALENDAR_SIZES)) {
            $this->size = ComponentConstants::getDefaultSize();
        }
    }

    /**
     * Initialize error state based on validation errors
     */
    private function initializeErrorState(): void
    {
        if (! $this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    public function isShorthand(): bool
    {
        return ! is_null($this->label);
    }

    public function hasError(): bool
    {
        return $this->hasError || $this->hasErrors();
    }

    public function hasErrors(): bool
    {
        if (is_null($this->errors)) {
            return false;
        }

        if (is_string($this->errors)) {
            return ! empty(trim($this->errors));
        }

        if (is_array($this->errors)) {
            return ! empty($this->errors);
        }

        if ($this->errors instanceof Collection) {
            return $this->errors->isNotEmpty();
        }

        return false;
    }

    public function getWeekdays(): array
    {
        return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    }

    public function getInitialCalendarData(): array
    {
        return [
            'currentMonth' => $this->currentMonth->format('Y-m'),
            'selectedDate' => $this->value instanceof Carbon ? $this->value->format('Y-m-d') : null,
            'startDate' => $this->startDate instanceof Carbon ? $this->startDate->format('Y-m-d') : null,
            'endDate' => $this->endDate instanceof Carbon ? $this->endDate->format('Y-m-d') : null,
            'isRange' => $this->isRange,
            'monthsToShow' => $this->monthsToShow,
            'minDate' => $this->minDate instanceof Carbon ? $this->minDate->format('Y-m-d') : null,
            'maxDate' => $this->maxDate instanceof Carbon ? $this->maxDate->format('Y-m-d') : null,
            'disabledDates' => $this->disabledDates,
            'weekdays' => $this->getWeekdays(),
            'monthNames' => [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
            ],
        ];
    }

    /**
     * Determine if a specific date should be disabled in the calendar
     *
     * This method checks multiple conditions to determine if a date should be disabled:
     * 1. Component-level disabled state
     * 2. Min/max date constraints
     * 3. Explicitly disabled dates array
     *
     * @param  Carbon  $date  The date to check
     * @return bool True if the date should be disabled
     */
    public function isDateDisabled(Carbon $date): bool
    {
        // If the entire calendar is disabled, all dates are disabled
        if ($this->disabled) {
            return true;
        }

        // Check if date is before the minimum allowed date
        if ($this->minDate instanceof Carbon && $date->lt($this->minDate)) {
            return true;
        }

        // Check if date is after the maximum allowed date
        if ($this->maxDate instanceof Carbon && $date->gt($this->maxDate)) {
            return true;
        }

        // Check if date is in the explicitly disabled dates array
        foreach ($this->disabledDates as $disabledDate) {
            try {
                $disabled = Carbon::parse($disabledDate);
                if ($date->isSameDay($disabled)) {
                    return true;
                }
            } catch (\Exception $e) {
                // Skip invalid date strings in the disabled dates array
                continue;
            }
        }

        return false;
    }

    public function getPreviousMonth(): Carbon
    {
        return $this->currentMonth->copy()->subMonth();
    }

    public function getNextMonth(): Carbon
    {
        return $this->currentMonth->copy()->addMonth();
    }

    /**
     * Get the formatted value for form submission
     *
     * This method handles both single date and range mode formatting:
     *
     * Single Date Mode:
     * - Returns 'Y-m-d' formatted string or null if no date selected
     *
     * Range Mode:
     * - Returns comma-separated start and end dates: 'Y-m-d,Y-m-d'
     * - If only start date is selected: 'Y-m-d,' (with trailing comma)
     * - If no dates selected: null
     *
     * The trailing comma in partial range selection allows JavaScript to
     * distinguish between no selection and partial selection state.
     *
     * @return string|null Formatted date value for form submission
     */
    public function getFormattedValue(): ?string
    {
        if ($this->isRange) {
            // Format range mode: start,end or start, (partial) or null (empty)
            $start = $this->startDate instanceof Carbon ? $this->startDate->format('Y-m-d') : '';
            $end = $this->endDate instanceof Carbon ? $this->endDate->format('Y-m-d') : '';

            if ($start && $end) {
                // Complete range selection
                return $start.','.$end;
            } elseif ($start) {
                // Partial range selection (only start date)
                return $start.',';
            } else {
                // No dates selected
                return null;
            }
        }

        // Single date mode - return formatted date or null
        return $this->value instanceof Carbon ? $this->value->format('Y-m-d') : null;
    }

    /**
     * Generate the month/year display string for the calendar header
     *
     * This method handles different display formats based on the number of months shown:
     *
     * Single Month (monthsToShow = 1):
     * - Format: "January 2024"
     *
     * Multiple Months - Same Year:
     * - Format: "January - March 2024" (shows month range within same year)
     *
     * Multiple Months - Different Years:
     * - Format: "December 2023 - February 2024" (shows full month/year range)
     *
     * @return string Formatted month/year display string
     */
    public function getMonthYearDisplay(): string
    {
        if ($this->monthsToShow > 1) {
            // Multi-month display - calculate start and end months
            $startMonth = $this->currentMonth;
            $endMonth = $this->currentMonth->copy()->addMonths($this->monthsToShow - 1);

            if ($startMonth->year === $endMonth->year) {
                // Same year - show "January - March 2024"
                return $startMonth->format('F').' - '.$endMonth->format('F Y');
            } else {
                // Different years - show "December 2023 - February 2024"
                return $startMonth->format('F Y').' - '.$endMonth->format('F Y');
            }
        }

        // Single month display - show "January 2024"
        return $this->currentMonth->format('F Y');
    }

    /**
     * Get the unique identifier for this calendar instance
     *
     * @return string The calendar's unique ID
     */
    public function getCalendarId(): string
    {
        return $this->id;
    }

    /**
     * Get comprehensive data attributes following Keys UI patterns
     *
     * @return array Data attributes array
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            // Component identification (Keys UI standard)
            'data-keys-calendar' => 'true',
            'data-keys-component' => 'true',

            // Core configuration
            'data-variant' => $this->isRange ? 'range' : 'single',
            'data-size' => $this->size,
            'data-months-to-show' => (string) $this->monthsToShow,
            'id' => $this->id,
        ];

        // State attributes
        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->hasError()) {
            $attributes['data-invalid'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        // Range-specific attributes
        if ($this->isRange) {
            $attributes['data-is-range'] = 'true';

            if ($this->startDate instanceof Carbon) {
                $attributes['data-has-start-date'] = 'true';
            }
            if ($this->endDate instanceof Carbon) {
                $attributes['data-has-end-date'] = 'true';
            }
            if ($this->startDate instanceof Carbon && $this->endDate instanceof Carbon) {
                $attributes['data-has-complete-range'] = 'true';
                $attributes['data-selection-state'] = 'complete';
            } elseif ($this->startDate instanceof Carbon) {
                $attributes['data-selection-state'] = 'partial';
            } else {
                $attributes['data-selection-state'] = 'empty';
            }
        } else {
            $attributes['data-is-range'] = 'false';
            if ($this->value instanceof Carbon) {
                $attributes['data-has-selection'] = 'true';
                $attributes['data-selection-state'] = 'selected';
            } else {
                $attributes['data-selection-state'] = 'empty';
            }
        }

        // Constraint attributes
        if ($this->minDate instanceof Carbon) {
            $attributes['data-has-min-date'] = 'true';
        }

        if ($this->maxDate instanceof Carbon) {
            $attributes['data-has-max-date'] = 'true';
        }

        if (! empty($this->disabledDates)) {
            $attributes['data-has-disabled-dates'] = 'true';
        }

        // Feature flags
        if (! empty($this->quickSelectors) && $this->quickSelectors !== false) {
            $attributes['data-has-quick-selectors'] = 'true';
        }

        if ($this->monthsToShow > 1) {
            $attributes['data-multi-month'] = 'true';
        }

        return $attributes;
    }

    /**
     * Get default quick selector options
     *
     * Returns the default set of quick date selector options with improved
     * labeling and better mode compatibility.
     *
     * @return array Array of quick selector options
     */
    public function getDefaultQuickSelectors(): array
    {
        return [
            ['label' => 'Today', 'value' => 'today', 'description' => 'Select today\'s date'],
            ['label' => 'Yesterday', 'value' => 'yesterday', 'description' => 'Select yesterday\'s date'],
            ['label' => 'Last 7 Days', 'value' => 'last7days', 'range' => true, 'description' => 'Select past week range'],
            ['label' => 'Last 30 Days', 'value' => 'last30days', 'range' => true, 'description' => 'Select past month range'],
            ['label' => 'This Month', 'value' => 'thismonth', 'range' => true, 'description' => 'Select current month range'],
            ['label' => 'Last Month', 'value' => 'lastmonth', 'range' => true, 'description' => 'Select previous month range'],
            ['label' => 'This Year', 'value' => 'thisyear', 'range' => true, 'description' => 'Select current year range'],
        ];
    }

    /**
     * Filter quick selectors based on range mode
     *
     * Intelligently filters quick selectors based on calendar mode.
     * Single date selectors work in both modes, range selectors only in range mode.
     *
     * @return array Filtered array of quick selector options
     */
    public function getFilteredQuickSelectors(): array
    {
        // If quickSelectors is false, return empty array
        if ($this->quickSelectors === false) {
            return [];
        }

        // If quickSelectors is true, use default selectors
        $selectors = is_array($this->quickSelectors) ? $this->quickSelectors : $this->getDefaultQuickSelectors();

        if (! $this->isRange) {
            // In single date mode, filter out range-only selectors
            // but keep selectors that can work in both modes
            $selectors = array_filter($selectors, function ($selector) {
                // Keep if no range flag (single date selectors)
                if (! isset($selector['range'])) {
                    return true;
                }

                // Keep if explicitly marked as compatible with single mode
                if (isset($selector['singleCompatible']) && $selector['singleCompatible']) {
                    return true;
                }

                // Filter out range-only selectors
                return ! $selector['range'];
            });
        }

        return array_values($selectors);
    }

    /**
     * Render the calendar component
     *
     * @return \Illuminate\View\View
     */
    public function render()
    {
        return view('keys::components.calendar', [
            'computedInitialData' => $this->getInitialCalendarData(),
            'computedWeekdays' => $this->getWeekdays(),
            'uniqueId' => $this->getCalendarId(),
            'monthYearDisplay' => $this->getMonthYearDisplay(),
            'formattedValue' => $this->getFormattedValue(),
            'dataAttributes' => $this->getDataAttributes(),
            'quickSelectors' => $this->getFilteredQuickSelectors(),
        ]);
    }
}
