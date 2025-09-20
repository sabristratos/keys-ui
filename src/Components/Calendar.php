<?php

namespace Keys\UI\Components;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\View\Component;

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
        public int $monthsToShow = 1
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
        $this->id = $this->id ?? $this->name ?? 'calendar-' . uniqid();
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
     * @param mixed $date The date value to parse (string, Carbon, or other)
     * @return Carbon|null Parsed Carbon instance or null if parsing fails
     */
    private function parseDate(mixed $date): ?Carbon
    {
        // Handle null or falsy values
        if (!$date) {
            return null;
        }

        // Return Carbon instances as-is
        if ($date instanceof Carbon) {
            return $date;
        }

        // Attempt to parse string values
        if (is_string($date) && !empty(trim($date))) {
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
        if (!in_array($this->size, ['sm', 'md', 'lg'])) {
            $this->size = 'md';
        }
    }

    /**
     * Initialize error state based on validation errors
     */
    private function initializeErrorState(): void
    {
        if (!$this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    public function isShorthand(): bool
    {
        return !is_null($this->label);
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
            return !empty(trim($this->errors));
        }

        if (is_array($this->errors)) {
            return !empty($this->errors);
        }

        if ($this->errors instanceof Collection) {
            return $this->errors->isNotEmpty();
        }

        return false;
    }

    public function getCalendarClasses(): string
    {
        $baseWidth = $this->monthsToShow > 1 ? 'min-w-[560px] w-full' : 'min-w-[280px] w-full max-w-[320px]';
        $base = 'calendar-component ' . $baseWidth . ' text-foreground';
        $size = $this->getSizeClasses();
        $state = $this->getStateClasses();

        return trim($base . ' ' . $size . ' ' . $state);
    }

    public function getSizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'text-sm',
            'md' => 'text-sm',
            'lg' => 'text-base',
            default => 'text-sm'
        };
    }

    public function getStateClasses(): string
    {
        if ($this->disabled) {
            return 'opacity-50 cursor-not-allowed border-neutral-300 dark:border-neutral-700';
        }

        if ($this->hasError()) {
            return 'border-danger';
        }

        return 'border-border hover:border-neutral-300 dark:hover:border-neutral-600';
    }

    public function getHeaderClasses(): string
    {
        return match ($this->size) {
            'sm' => 'px-3 py-2 text-sm font-medium',
            'md' => 'px-4 py-3 text-sm font-semibold',
            'lg' => 'px-5 py-4 text-base font-semibold',
            default => 'px-4 py-3 text-sm font-semibold'
        };
    }

    public function getCellClasses(): string
    {
        return match ($this->size) {
            'sm' => 'w-8 h-8 text-xs',
            'md' => 'w-10 h-10 text-sm',
            'lg' => 'w-12 h-12 text-base',
            default => 'w-10 h-10 text-sm'
        };
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
                'July', 'August', 'September', 'October', 'November', 'December'
            ]
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
     * @param Carbon $date The date to check
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
                return $start . ',' . $end;
            } elseif ($start) {
                // Partial range selection (only start date)
                return $start . ',';
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
                return $startMonth->format('F') . ' - ' . $endMonth->format('F Y');
            } else {
                // Different years - show "December 2023 - February 2024"
                return $startMonth->format('F Y') . ' - ' . $endMonth->format('F Y');
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

    // Computed methods for consistent pattern with other Keys UI components
    public function getComputedCalendarClasses(): string
    {
        return $this->getCalendarClasses();
    }

    public function getComputedHeaderClasses(): string
    {
        return $this->getHeaderClasses();
    }

    public function getComputedCellClasses(): string
    {
        return $this->getCellClasses();
    }

    public function getComputedInitialData(): array
    {
        return $this->getInitialCalendarData();
    }

    public function getComputedWeekdays(): array
    {
        return $this->getWeekdays();
    }

    /**
     * Render the calendar component
     *
     * @return \Illuminate\View\View
     */
    public function render()
    {
        return view('keys::components.calendar', [
            'computedCalendarClasses' => $this->getComputedCalendarClasses(),
            'computedHeaderClasses' => $this->getComputedHeaderClasses(),
            'computedCellClasses' => $this->getComputedCellClasses(),
            'computedInitialData' => $this->getComputedInitialData(),
            'computedWeekdays' => $this->getComputedWeekdays(),
            'uniqueId' => $this->getCalendarId(),
            'monthYearDisplay' => $this->getMonthYearDisplay(),
            'formattedValue' => $this->getFormattedValue(),
            'isRange' => $this->isRange,
            'monthsToShow' => $this->monthsToShow,
        ]);
    }
}