<?php

namespace Keys\UI\Components;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\View\Component;

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
     */
    private function initializeProperties(): void
    {
        $this->id = $this->id ?? $this->name ?? 'date-picker-' . uniqid();

        // Set display format to match format if not specified
        if (!$this->displayFormat) {
            $this->displayFormat = $this->format;
        }

        // Set default placeholder based on format
        if (!$this->placeholder) {
            if ($this->isRange) {
                $this->placeholder = $this->getFormatPlaceholder($this->displayFormat) . ' - ' . $this->getFormatPlaceholder($this->displayFormat);
            } else {
                $this->placeholder = $this->getFormatPlaceholder($this->displayFormat);
            }
        }

        // Note: Calendar icon is handled separately in template, not as iconRight
    }

    /**
     * Process and parse date values
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
     */
    private function parseDate(mixed $date): ?Carbon
    {
        if (!$date) {
            return null;
        }

        if ($date instanceof Carbon) {
            return $date;
        }

        if (is_string($date) && !empty(trim($date))) {
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
     */
    private function validateProperties(): void
    {
        // Validate size
        if (!in_array($this->size, ['sm', 'md', 'lg'])) {
            $this->size = 'md';
        }

        // Validate monthsToShow
        if ($this->monthsToShow < 1 || $this->monthsToShow > 12) {
            $this->monthsToShow = 1;
        }
    }

    /**
     * Initialize error state
     */
    private function initializeErrorState(): void
    {
        if (!$this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    /**
     * Get placeholder text for date format
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

    /**
     * Get the formatted value for the input display
     */
    public function getFormattedValue(): string
    {
        if ($this->isRange) {
            $start = $this->startDate instanceof Carbon ? $this->startDate->format($this->displayFormat) : '';
            $end = $this->endDate instanceof Carbon ? $this->endDate->format($this->displayFormat) : '';

            if ($start && $end) {
                return $start . ' - ' . $end;
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
     */
    public function getSubmitValue(): ?string
    {
        if ($this->isRange) {
            $start = $this->startDate instanceof Carbon ? $this->startDate->format($this->format) : '';
            $end = $this->endDate instanceof Carbon ? $this->endDate->format($this->format) : '';

            if ($start && $end) {
                return $start . ',' . $end;
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
            'format' => $this->format,
            'displayFormat' => $this->displayFormat,
            'closeOnSelect' => $this->closeOnSelect,
        ];
    }

    /**
     * Get input classes
     */
    public function getInputClasses(): string
    {
        $base = 'date-picker-input block w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
        $size = $this->getSizeClasses();
        $state = $this->getStateClasses();
        $padding = $this->getPaddingClasses();

        return trim($base . ' ' . $size . ' ' . $state . ' ' . $padding);
    }

    /**
     * Get size classes
     */
    public function getSizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'text-sm',
            'md' => 'text-sm',
            'lg' => 'text-base',
            default => 'text-sm'
        };
    }

    /**
     * Get state classes
     */
    public function getStateClasses(): string
    {
        if ($this->disabled) {
            return 'bg-surface border-border text-muted cursor-not-allowed opacity-50';
        }

        if ($this->hasError()) {
            return 'bg-input border-danger text-foreground focus:border-danger focus:ring-danger';
        }

        return 'bg-input border-border text-foreground focus:border-brand focus:ring-brand hover:border-neutral';
    }

    /**
     * Get padding classes based on icons
     */
    public function getPaddingClasses(): string
    {
        $leftPadding = match ($this->size) {
            'sm' => $this->iconLeft ? 'pl-8' : 'pl-3',
            'md' => $this->iconLeft ? 'pl-10' : 'pl-3',
            'lg' => $this->iconLeft ? 'pl-12' : 'pl-4',
            default => $this->iconLeft ? 'pl-10' : 'pl-3'
        };

        $rightPadding = match ($this->size) {
            'sm' => ($this->iconRight || $this->clearable || $this->showCalendarIcon) ? 'pr-12' : 'pr-3',
            'md' => ($this->iconRight || $this->clearable || $this->showCalendarIcon) ? 'pr-14' : 'pr-3',
            'lg' => ($this->iconRight || $this->clearable || $this->showCalendarIcon) ? 'pr-16' : 'pr-4',
            default => ($this->iconRight || $this->clearable || $this->showCalendarIcon) ? 'pr-14' : 'pr-3'
        };

        $verticalPadding = match ($this->size) {
            'sm' => 'py-1.5',
            'md' => 'py-2',
            'lg' => 'py-2.5',
            default => 'py-2'
        };

        return trim($leftPadding . ' ' . $rightPadding . ' ' . $verticalPadding);
    }

    /**
     * Get icon size
     */
    public function getIconSize(): string
    {
        return match ($this->size) {
            'sm' => 'xs',
            'md' => 'sm',
            'lg' => 'md',
            default => 'sm'
        };
    }

    /**
     * Get quick selector options
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
     * Filter quick selectors based on range mode
     */
    public function getFilteredQuickSelectors(): array
    {
        // If quickSelectors is false, return empty array
        if ($this->quickSelectors === false) {
            return [];
        }

        // If quickSelectors is true, use default selectors
        $selectors = is_array($this->quickSelectors) ? $this->quickSelectors : $this->getQuickSelectors();

        if (!$this->isRange) {
            // Filter out range selectors for single date mode
            $selectors = array_filter($selectors, fn($s) => !isset($s['range']) || !$s['range']);
        }

        return array_values($selectors);
    }

    /**
     * Render the component
     */
    public function render()
    {
        return view('keys::components.date-picker', [
            'formattedValue' => $this->getFormattedValue(),
            'submitValue' => $this->getSubmitValue(),
            'calendarData' => $this->getCalendarData(),
            'inputClasses' => $this->getInputClasses(),
            'iconSize' => $this->getIconSize(),
            'quickSelectors' => $this->getFilteredQuickSelectors(),
        ]);
    }
}