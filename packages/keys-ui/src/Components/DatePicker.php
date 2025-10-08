<?php

namespace Keys\UI\Components;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;
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
    use HandlesValidationErrors;

    public function __construct(

        public ?string $name = null,
        public ?string $id = null,
        public mixed $value = null,
        public ?string $placeholder = null,


        public string $format = 'Y-m-d',
        public ?string $displayFormat = null,
        public bool $isRange = false,
        public mixed $startDate = null,
        public mixed $endDate = null,


        public string|Carbon|null $minDate = null,
        public string|Carbon|null $maxDate = null,
        public array $disabledDates = [],
        public int $monthsToShow = 1,
        public bool|array $quickSelectors = false,


        public string $size = 'md',
        public string $width = 'full',
        public bool $inline = false,
        public bool $disabled = false,
        public bool $readonly = false,
        public bool $clearable = false,
        public bool $showCalendarIcon = true,
        public bool $closeOnSelect = true,
        public ?string $iconLeft = null,
        public ?string $iconRight = null,
        public ?string $customTrigger = null,


        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $hasError = false
    ) {
        
        $this->id = $this->id ?? $this->name ?? 'date-picker-' . uniqid();
        $this->displayFormat = $this->displayFormat ?? $this->format;

        if (!$this->placeholder) {
            $this->placeholder = $this->isRange
                ? $this->getFormatPlaceholder($this->displayFormat) . ' - ' . $this->getFormatPlaceholder($this->displayFormat)
                : $this->getFormatPlaceholder($this->displayFormat);
        }

        
        if ($this->isRange) {
            if ($this->value) {
                if (is_string($this->value) && str_contains($this->value, ',')) {
                    [$start, $end] = explode(',', $this->value, 2);
                    $this->startDate = $this->parseDate(trim($start));
                    $this->endDate = $this->parseDate(trim($end));
                } elseif (is_array($this->value) && isset($this->value[0], $this->value[1]) && is_countable($this->value) && count($this->value) === 2) {
                    $this->startDate = $this->parseDate($this->value[0]);
                    $this->endDate = $this->parseDate($this->value[1]);
                }
            } else {
                $this->startDate = $this->parseDate($this->startDate);
                $this->endDate = $this->parseDate($this->endDate);
            }
        } else {
            $this->value = $this->parseDate($this->value);
        }

        $this->minDate = $this->parseDate($this->minDate);
        $this->maxDate = $this->parseDate($this->maxDate);

        
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_SM_TO_LG, 'md');
        if ($this->monthsToShow < 1 || $this->monthsToShow > 12) {
            $this->monthsToShow = 1;
        }

        
        \Log::debug("DatePicker Debug [{$this->name}] - Constructor Error Check", [
            'errors_type' => is_object($this->errors) ? get_class($this->errors) : gettype($this->errors),
            'errors_value' => is_object($this->errors) ? 'object' : $this->errors,
            'initial_hasError' => $this->hasError,
            'hasErrors_result' => $this->hasErrors()
        ]);

        
    }

    /**
     * Parse a date value to Carbon instance or null
     */
    private function parseDate(mixed $date): ?Carbon
    {
        if (!$date) return null;
        if ($date instanceof Carbon) return $date;
        if (is_string($date) && !empty(trim($date))) {
            try {
                return Carbon::parse($date);
            } catch (\Exception) {
                return null;
            }
        }
        return null;
    }

    /**
     * Get placeholder text for date format (simplified)
     */
    private function getFormatPlaceholder(string $format): string
    {
        return match ($format) {
            'Y-m-d' => 'YYYY-MM-DD',
            'Y/m/d' => 'YYYY/MM/DD',
            'd-m-Y' => 'DD-MM-YYYY',
            'd/m/Y' => 'DD/MM/YYYY',
            'm/d/Y' => 'MM/DD/YYYY',
            'm-d-Y' => 'MM-DD-YYYY',
            'F j, Y' => 'Month DD, YYYY',
            'M j, Y' => 'Mon DD, YYYY',
            'j F Y' => 'DD Month YYYY',
            default => 'YYYY-MM-DD',
        };
    }

    /**
     * Essential business logic methods only
     */
    public function isShorthand(): bool
    {
        return !is_null($this->label);
    }

    public function hasError(): bool
    {
        $result = $this->hasError || $this->hasErrors();
        \Log::debug("DatePicker Debug [{$this->name}] - hasError() method called", [
            'hasError_property' => $this->hasError,
            'hasErrors_method' => $this->hasErrors(),
            'final_result' => $result
        ]);
        return $result;
    }


    /**
     * Get formatted value for display (simplified)
     */
    public function getFormattedValue(): string
    {
        if ($this->isRange) {
            $start = $this->startDate?->format($this->displayFormat) ?? '';
            $end = $this->endDate?->format($this->displayFormat) ?? '';
            return $start && $end ? "$start - $end" : $start;
        }
        return $this->value?->format($this->displayFormat) ?? '';
    }

    /**
     * Get value for form submission (simplified)
     */
    public function getSubmitValue(): ?string
    {
        if ($this->isRange) {
            $start = $this->startDate?->format($this->format) ?? '';
            $end = $this->endDate?->format($this->format) ?? '';
            return $start && $end ? "$start,$end" : ($start ?: null);
        }
        return $this->value?->format($this->format) ?? null;
    }

    /**
     * Get calendar data (essential only)
     */
    public function getCalendarData(): array
    {
        return [
            'currentMonth' => ($this->value ?? $this->startDate ?? Carbon::now())->format('Y-m'),
            'selectedDate' => $this->value?->format('Y-m-d'),
            'startDate' => $this->startDate?->format('Y-m-d'),
            'endDate' => $this->endDate?->format('Y-m-d'),
            'isRange' => $this->isRange,
            'monthsToShow' => $this->monthsToShow,
            'minDate' => $this->minDate?->format('Y-m-d'),
            'maxDate' => $this->maxDate?->format('Y-m-d'),
            'disabledDates' => $this->disabledDates,
            'format' => $this->format,
            'displayFormat' => $this->displayFormat,
        ];
    }

    /**
     * Generate comprehensive data attributes following Keys UI standards
     */
    public function getDataAttributes(): array
    {
        $attributes = [

            'data-keys-date-picker' => 'true',
            'data-keys-group-target' => 'true',


            'data-size' => $this->size,
            'data-width' => $this->width,
            'data-format' => $this->format,
            'data-display-format' => $this->displayFormat,
            'data-inline' => $this->inline ? 'true' : 'false',


            'data-range' => $this->isRange ? 'true' : 'false',
            'data-clearable' => $this->clearable ? 'true' : 'false',
            'data-has-calendar-icon' => $this->showCalendarIcon ? 'true' : 'false',
            'data-close-on-select' => $this->closeOnSelect ? 'true' : 'false',
        ];

        
        if ($this->disabled) $attributes['data-disabled'] = 'true';
        if ($this->readonly) $attributes['data-readonly'] = 'true';
        if ($this->required) $attributes['data-required'] = 'true';
        if ($this->hasError()) $attributes['data-invalid'] = 'true';
        if ($this->getFormattedValue()) $attributes['data-has-value'] = 'true';

        
        if ($this->iconLeft) {
            $attributes['data-has-icon-left'] = 'true';
            $attributes['data-icon-left'] = $this->iconLeft;
        }
        if ($this->iconRight) {
            $attributes['data-has-icon-right'] = 'true';
            $attributes['data-icon-right'] = $this->iconRight;
        }

        
        if ($this->monthsToShow > 1) {
            $attributes['data-months-to-show'] = (string) $this->monthsToShow;
        }
        if ($this->quickSelectors) {
            $attributes['data-has-quick-selectors'] = 'true';
        }
        if ($this->minDate) {
            $attributes['data-min-date'] = $this->minDate->format('Y-m-d');
        }
        if ($this->maxDate) {
            $attributes['data-max-date'] = $this->maxDate->format('Y-m-d');
        }
        if (!empty($this->disabledDates)) {
            $attributes['data-has-disabled-dates'] = 'true';
        }

        
        if ($this->isRange) {
            if ($this->startDate) $attributes['data-has-start-date'] = 'true';
            if ($this->endDate) $attributes['data-has-end-date'] = 'true';
            if ($this->startDate && $this->endDate) $attributes['data-range-complete'] = 'true';
        }

        
        if ($this->customTrigger) {
            $attributes['data-has-custom-trigger'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the component (simplified)
     */
    public function render()
    {
        
        $defaultQuickSelectors = [
            ['label' => __('keys-ui::keys-ui.datepicker.today'), 'value' => 'today'],
            ['label' => __('keys-ui::keys-ui.datepicker.yesterday'), 'value' => 'yesterday'],
            ['label' => __('keys-ui::keys-ui.datepicker.last_7_days'), 'value' => 'last7days', 'range' => true],
            ['label' => __('keys-ui::keys-ui.datepicker.last_30_days'), 'value' => 'last30days', 'range' => true],
            ['label' => __('keys-ui::keys-ui.datepicker.this_month'), 'value' => 'thismonth', 'range' => true],
            ['label' => __('keys-ui::keys-ui.datepicker.last_month'), 'value' => 'lastmonth', 'range' => true],
        ];

        $quickSelectors = $this->quickSelectors === false
            ? []
            : (is_array($this->quickSelectors) ? $this->quickSelectors : $defaultQuickSelectors);

        $hasErrorResult = $this->hasError();
        \Log::debug("DatePicker Debug [{$this->name}] - Template variable assignment", [
            'hasError_result' => $hasErrorResult,
            'property_value' => $this->hasError,
            'method_result' => $this->hasErrors()
        ]);

        return view('keys::components.date-picker', [
            'formattedValue' => $this->getFormattedValue(),
            'submitValue' => $this->getSubmitValue(),
            'calendarData' => $this->getCalendarData(),
            'quickSelectorsData' => $quickSelectors,
            'dataAttributes' => $this->getDataAttributes(),
            'isShorthand' => $this->isShorthand(),
            'hasError' => $hasErrorResult,
        ]);
    }
}
