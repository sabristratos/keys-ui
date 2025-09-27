<?php

namespace Keys\UI\Components;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * DatePicker Component
 *
 * A comprehensive date picker component with support for single dates, date ranges,
 * popover and inline modes, validation, and extensive customization options.
 *
 * Features:
 * - Single date and date range selection
 * - Popover (dropdown) and inline display modes
 * - Calendar integration with min/max dates and disabled dates
 * - Quick date selectors (today, yesterday, last 7 days, etc.)
 * - Form validation and error display
 * - Customizable formatting and display options
 * - Livewire compatibility
 * - Accessibility compliant
 *
 * @since 1.0.0
 */
class DatePicker extends Component
{
    public function __construct(
        // Core input properties
        public ?string $name = null,
        public ?string $id = null,
        public mixed $value = null,
        public ?string $placeholder = null,

        // Date picker specific properties
        public string $format = 'Y-m-d',
        public ?string $displayFormat = null,
        public bool $closeOnSelect = true,
        public bool $showCalendarIcon = true,
        public bool $inline = false,
        public bool|array $quickSelectors = false,

        // Calendar properties
        public string|Carbon|null $minDate = null,
        public string|Carbon|null $maxDate = null,
        public array $disabledDates = [],
        public bool $isRange = false,
        public mixed $startDate = null,
        public mixed $endDate = null,
        public int $monthsToShow = 1,

        // Input properties
        public string $size = 'md',
        public bool $disabled = false,
        public bool $readonly = false,
        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $hasError = false,
        public bool $clearable = false,
        public ?string $iconLeft = null,
        public ?string $iconRight = null,
        public ?string $customTrigger = null
    ) {
        $this->initializeProperties();
        $this->processDateValues();
        $this->validateProperties();
        $this->initializeErrorState();
    }

    /**
     * Initialize basic properties
     *
     * Sets up the component ID, display format, and placeholder text based on
     * the provided props or sensible defaults.
     */
    private function initializeProperties(): void
    {
        $this->id = $this->id ?? $this->name ?? 'date-picker-'.uniqid();

        // Set display format to match format if not specified
        if (! $this->displayFormat) {
            $this->displayFormat = $this->format;
        }

        // Set default placeholder based on format
        if (! $this->placeholder) {
            if ($this->isRange) {
                $this->placeholder = $this->getFormatPlaceholder($this->displayFormat).' - '.$this->getFormatPlaceholder($this->displayFormat);
            } else {
                $this->placeholder = $this->getFormatPlaceholder($this->displayFormat);
            }
        }

        // Note: Calendar icon is handled separately in template, not as iconRight
    }

    /**
     * Process and parse date values
     *
     * Handles date processing for both single date and range modes,
     * parsing various input formats and setting up internal date properties.
     */
    private function processDateValues(): void
    {
        if ($this->isRange) {
            // Process range dates
            if ($this->value) {
                // If value is a string with comma separator
                if (is_string($this->value) && strpos($this->value, ',') !== false) {
                    [$start, $end] = explode(',', $this->value, 2);
                    $this->startDate = $this->parseDate(trim($start));
                    $this->endDate = $this->parseDate(trim($end));
                } elseif (is_array($this->value) && count($this->value) === 2) {
                    // If value is an array with two elements
                    $this->startDate = $this->parseDate($this->value[0]);
                    $this->endDate = $this->parseDate($this->value[1]);
                }
            } else {
                // Use individual start/end date props
                $this->startDate = $this->parseDate($this->startDate);
                $this->endDate = $this->parseDate($this->endDate);
            }
        } else {
            // Process single date
            $this->value = $this->parseDate($this->value);
        }

        // Parse min/max dates
        $this->minDate = $this->parseDate($this->minDate);
        $this->maxDate = $this->parseDate($this->maxDate);
    }

    /**
     * Parse a date value to Carbon instance or null
     *
     * Safely parses various date input types (string, Carbon, etc.) and returns
     * a Carbon instance or null if parsing fails. Handles errors gracefully.
     *
     * @param  mixed  $date  The date value to parse
     * @return Carbon|null Parsed Carbon instance or null
     */
    private function parseDate(mixed $date): ?Carbon
    {
        if (! $date) {
            return null;
        }

        if ($date instanceof Carbon) {
            return $date;
        }

        if (is_string($date) && ! empty(trim($date))) {
            try {
                return Carbon::parse($date);
            } catch (\Exception $e) {
                return null;
            }
        }

        return null;
    }

    /**
     * Validate component properties
     *
     * Validates and normalizes component properties like size and monthsToShow
     * to ensure they fall within acceptable ranges.
     */
    private function validateProperties(): void
    {
        // Validate size
        if (! in_array($this->size, ComponentConstants::DATEPICKER_SIZES)) {
            $this->size = ComponentConstants::getDefaultSize();
        }

        // Validate monthsToShow
        if ($this->monthsToShow < 1 || $this->monthsToShow > 12) {
            $this->monthsToShow = 1;
        }
    }

    /**
     * Initialize error state
     *
     * Sets up the error state based on validation errors passed to the component.
     */
    private function initializeErrorState(): void
    {
        if (! $this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    /**
     * Get placeholder text for date format
     *
     * Returns appropriate placeholder text based on the date format.
     * Maps common date formats to user-friendly placeholder strings.
     *
     * @param  string  $format  The date format string
     * @return string The placeholder text
     */
    private function getFormatPlaceholder(string $format): string
    {
        $placeholders = [
            'Y-m-d' => 'YYYY-MM-DD',
            'Y/m/d' => 'YYYY/MM/DD',
            'd-m-Y' => 'DD-MM-YYYY',
            'd/m/Y' => 'DD/MM/YYYY',
            'm/d/Y' => 'MM/DD/YYYY',
            'm-d-Y' => 'MM-DD-YYYY',
            'F j, Y' => 'Month DD, YYYY',
            'M j, Y' => 'Mon DD, YYYY',
            'j F Y' => 'DD Month YYYY',
        ];

        return $placeholders[$format] ?? 'YYYY-MM-DD';
    }

    /**
     * Check if component is in shorthand mode
     *
     * Shorthand mode includes a label and wraps the component in additional markup.
     *
     * @return bool True if component has a label (shorthand mode)
     */
    public function isShorthand(): bool
    {
        return ! is_null($this->label);
    }

    /**
     * Check if component has validation errors
     *
     * @return bool True if component has any validation errors
     */
    public function hasError(): bool
    {
        return $this->hasError || $this->hasErrors();
    }

    /**
     * Check if errors exist in various formats
     *
     * Handles multiple error formats: string, array, Collection, MessageBag, ViewErrorBag.
     *
     * @return bool True if any errors exist
     */
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

        // Handle Laravel MessageBag
        if (is_object($this->errors) && method_exists($this->errors, 'any')) {
            return $this->errors->any();
        }

        // Handle ViewErrorBag
        if (is_object($this->errors) && method_exists($this->errors, 'getBag')) {
            try {
                $bag = $this->errors->getBag('default');

                return $bag && $bag->any();
            } catch (\Exception $e) {
                // If getBag fails, treat as no errors
                return false;
            }
        }

        return false;
    }

    /**
     * Get the formatted value for the input display
     *
     * Returns the display-formatted date(s) for showing in the component.
     * For ranges, returns "start - end" format or just start date for incomplete ranges.
     *
     * @return string The formatted display value
     */
    public function getFormattedValue(): string
    {
        if ($this->isRange) {
            $start = $this->startDate instanceof Carbon ? $this->startDate->format($this->displayFormat) : '';
            $end = $this->endDate instanceof Carbon ? $this->endDate->format($this->displayFormat) : '';

            if ($start && $end) {
                return $start.' - '.$end;
            } elseif ($start) {
                return $start;
            } else {
                return '';
            }
        } else {
            return $this->value instanceof Carbon ? $this->value->format($this->displayFormat) : '';
        }
    }

    /**
     * Get the value for form submission
     *
     * Returns the properly formatted value for form submission.
     * For ranges, returns comma-separated values ("start,end").
     *
     * @return string|null The formatted submission value
     */
    public function getSubmitValue(): ?string
    {
        if ($this->isRange) {
            $start = $this->startDate instanceof Carbon ? $this->startDate->format($this->format) : '';
            $end = $this->endDate instanceof Carbon ? $this->endDate->format($this->format) : '';

            if ($start && $end) {
                return $start.','.$end;
            } elseif ($start) {
                // Return just start date for incomplete range (no trailing comma)
                return $start;
            } else {
                return null;
            }
        } else {
            return $this->value instanceof Carbon ? $this->value->format($this->format) : null;
        }
    }

    /**
     * Get calendar data for JavaScript initialization
     *
     * Prepares essential configuration data for the Calendar component.
     * Simplified to only include data that Calendar actually needs.
     *
     * @return array Calendar configuration data
     */
    public function getCalendarData(): array
    {
        $currentMonth = $this->value instanceof Carbon
            ? $this->value->format('Y-m')
            : ($this->startDate instanceof Carbon
                ? $this->startDate->format('Y-m')
                : Carbon::now()->format('Y-m'));

        return [
            'currentMonth' => $currentMonth,
            'selectedDate' => $this->value instanceof Carbon ? $this->value->format('Y-m-d') : null,
            'startDate' => $this->startDate instanceof Carbon ? $this->startDate->format('Y-m-d') : null,
            'endDate' => $this->endDate instanceof Carbon ? $this->endDate->format('Y-m-d') : null,
            'isRange' => $this->isRange,
            'monthsToShow' => $this->monthsToShow,
            'minDate' => $this->minDate instanceof Carbon ? $this->minDate->format('Y-m-d') : null,
            'maxDate' => $this->maxDate instanceof Carbon ? $this->maxDate->format('Y-m-d') : null,
            'disabledDates' => $this->disabledDates,
        ];
    }

    /**
     * Get quick selector options
     *
     * Returns the default set of quick date selector options like
     * "Today", "Yesterday", "Last 7 Days", etc.
     *
     * @return array Array of quick selector options
     */
    public function getQuickSelectors(): array
    {
        return [
            ['label' => 'Today', 'value' => 'today'],
            ['label' => 'Yesterday', 'value' => 'yesterday'],
            ['label' => 'Last 7 Days', 'value' => 'last7days', 'range' => true],
            ['label' => 'Last 30 Days', 'value' => 'last30days', 'range' => true],
            ['label' => 'This Month', 'value' => 'thismonth', 'range' => true],
            ['label' => 'Last Month', 'value' => 'lastmonth', 'range' => true],
            ['label' => 'This Year', 'value' => 'thisyear', 'range' => true],
        ];
    }

    /**
     * Format a date using Carbon for display purposes
     *
     * This method provides server-side date formatting that JavaScript can use
     * to ensure consistent formatting across client and server.
     *
     * @param  string  $dateString  The date string to format (Y-m-d format)
     * @param  string  $displayFormat  The display format (PHP date format)
     * @return string The formatted date string
     */
    public static function formatDateForDisplay(string $dateString, string $displayFormat): string
    {
        try {
            return Carbon::parse($dateString)->format($displayFormat);
        } catch (\Exception $e) {
            return $dateString;
        }
    }


    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality
     *
     * Creates data attributes for component state, configuration, and JavaScript integration.
     * Used for CSS selectors, JavaScript targeting, and accessibility.
     *
     * @return array Array of data attribute key-value pairs
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-date-picker' => 'true',
            'data-format' => $this->format,
            'data-display-format' => $this->displayFormat,
            'data-size' => $this->size,
            'data-inline' => $this->inline ? 'true' : 'false',
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->readonly) {
            $attributes['data-readonly'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->hasError()) {
            $attributes['data-invalid'] = 'true';
        }

        if ($this->clearable) {
            $attributes['data-clearable'] = 'true';
        }

        if ($this->isRange) {
            $attributes['data-range'] = 'true';
        }

        if ($this->iconLeft) {
            $attributes['data-has-icon-left'] = 'true';
        }

        if ($this->iconRight) {
            $attributes['data-has-icon-right'] = 'true';
        }

        if ($this->showCalendarIcon) {
            $attributes['data-has-calendar-icon'] = 'true';
        }

        if ($this->getFormattedValue()) {
            $attributes['data-has-value'] = 'true';
        }

        if ($this->quickSelectors) {
            $attributes['data-has-quick-selectors'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the component
     *
     * Renders the DatePicker component view with all computed data and attributes.
     *
     * @return \Illuminate\View\View The rendered component view
     */
    public function render()
    {
        // Get raw quick selectors - Calendar will handle conditional display
        $quickSelectors = $this->quickSelectors === false
            ? []
            : (is_array($this->quickSelectors) ? $this->quickSelectors : $this->getQuickSelectors());

        return view('keys::components.date-picker', [
            'formattedValue' => $this->getFormattedValue(),
            'submitValue' => $this->getSubmitValue(),
            'calendarData' => $this->getCalendarData(),
            'quickSelectors' => $quickSelectors,
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
