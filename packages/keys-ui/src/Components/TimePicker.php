<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;

/**
 * TimePicker Component
 *
 * A comprehensive time selection component with 12/24 hour format support,
 * configurable step intervals, and modern popover-based interface.
 * Uses the Popover component for consistent positioning and accessibility.
 */
class TimePicker extends Component
{
    use HandlesValidationErrors;

    /**
     * Create a new TimePicker component instance.
     *
     * @param  string|null  $name  Form field name
     * @param  string|null  $id  TimePicker ID (auto-generated if not provided)
     * @param  string|null  $value  Time value
     * @param  string|null  $placeholder  Placeholder text
     * @param  string  $format  Time format ('12' or '24')
     * @param  int  $step  Minute step intervals (1, 5, 15, 30)
     * @param  string|null  $minTime  Minimum time allowed
     * @param  string|null  $maxTime  Maximum time allowed
     * @param  string  $size  Size variant (sm, md, lg)
     * @param  bool  $disabled  Whether the timepicker is disabled
     * @param  bool  $readonly  Whether the timepicker is readonly
     * @param  bool  $required  Whether the timepicker is required
     * @param  string|null  $label  Label text for shorthand mode
     * @param  bool  $optional  Whether to show optional indicator
     * @param  string|array|Collection|null  $errors  Validation errors
     * @param  bool  $showErrors  Whether to display validation errors
     * @param  bool  $hasError  Force error state
     * @param  bool  $clearable  Enable clear functionality
     * @param  bool  $showSeconds  Show seconds in time selection
     * @param  string  $formatMode  Format mode ('12', '24', 'flexible')
     */
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = null,
        public ?string $placeholder = null,
        public string $format = '24',
        public int $step = 1,
        public ?string $minTime = null,
        public ?string $maxTime = null,
        public string $size = 'md',
        public string $width = 'full',
        public bool $disabled = false,
        public bool $readonly = false,
        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $hasError = false,
        public bool $clearable = false,
        public bool $showSeconds = false,
        public string $formatMode = 'flexible'
    ) {
        
        $this->id = $this->id ?? $this->name ?? 'timepicker-'.uniqid();

        
        if (! in_array($this->formatMode, ['12', '24', 'flexible'])) {
            $this->formatMode = 'flexible';
        }

        
        if ($this->formatMode === '12') {
            $this->format = '12';
        } elseif ($this->formatMode === '24') {
            $this->format = '24';
        }

        
        if (! in_array($this->format, ['12', '24'])) {
            $this->format = '24';
        }

        
        if (! in_array($this->step, [1, 5, 15, 30])) {
            $this->step = 1;
        }

        
        if ($this->value) {
            $this->value = $this->formatTimeValue($this->value);
        }

        
        if (! $this->placeholder) {
            $this->placeholder = $this->format === '12'
                ? ($this->showSeconds ? 'h:mm:ss AM' : 'h:mm AM')
                : ($this->showSeconds ? 'HH:mm:ss' : 'HH:mm');
        }

        if (! $this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    /**
     * Check if the component is using shorthand mode (with label).
     */
    public function isShorthand(): bool
    {
        return ! is_null($this->label);
    }

    /**
     * Check if the timepicker has an error state.
     */
    public function hasError(): bool
    {
        return $this->hasError || $this->hasErrors();
    }


    public function getHourOptions(): array
    {
        if ($this->format === '12') {
            return range(1, 12);
        }

        return range(0, 23);
    }

    public function getMinuteOptions(): array
    {
        $minutes = [];
        for ($i = 0; $i < 60; $i += $this->step) {
            $minutes[] = $i;
        }

        return $minutes;
    }

    public function getSecondOptions(): array
    {
        return range(0, 59);
    }

    public function getPeriodOptions(): array
    {
        return ['AM', 'PM'];
    }

    /**
     * Get quick time presets based on format
     */
    public function getTimePresets(): array
    {
        if ($this->format === '12') {
            return [
                ['label' => __('keys-ui::keys-ui.timepicker.morning'), 'time' => '9:00 AM'],
                ['label' => __('keys-ui::keys-ui.timepicker.noon'), 'time' => '12:00 PM'],
                ['label' => __('keys-ui::keys-ui.timepicker.afternoon'), 'time' => '3:00 PM'],
                ['label' => __('keys-ui::keys-ui.timepicker.evening'), 'time' => '6:00 PM'],
            ];
        } else {
            return [
                ['label' => __('keys-ui::keys-ui.timepicker.morning'), 'time' => '09:00'],
                ['label' => __('keys-ui::keys-ui.timepicker.noon'), 'time' => '12:00'],
                ['label' => __('keys-ui::keys-ui.timepicker.afternoon'), 'time' => '15:00'],
                ['label' => __('keys-ui::keys-ui.timepicker.evening'), 'time' => '18:00'],
            ];
        }
    }

    /**
     * Format time value according to component settings.
     */
    public function formatTimeValue(?string $time): ?string
    {
        if (! $time) {
            return null;
        }

        try {
            $parsedTime = \DateTime::createFromFormat('H:i:s', $time);
            if (! $parsedTime) {
                $parsedTime = \DateTime::createFromFormat('H:i', $time);
            }
            if (! $parsedTime) {
                $parsedTime = \DateTime::createFromFormat('g:i A', $time);
            }
            if (! $parsedTime) {
                $parsedTime = \DateTime::createFromFormat('g:i:s A', $time);
            }

            if ($parsedTime) {
                if ($this->format === '12') {
                    return $this->showSeconds
                        ? $parsedTime->format('g:i:s A')
                        : $parsedTime->format('g:i A');
                } else {
                    return $this->showSeconds
                        ? $parsedTime->format('H:i:s')
                        : $parsedTime->format('H:i');
                }
            }
        } catch (\Exception $e) {
            
        }

        return $time;
    }

    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-timepicker' => 'true',
            'data-keys-group-target' => 'true',
            'data-format' => $this->format,
            'data-format-mode' => $this->formatMode,
            'data-step' => $this->step,
            'data-size' => $this->size,
            'data-width' => $this->width,
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

        if ($this->showSeconds) {
            $attributes['data-show-seconds'] = 'true';
        }

        if (! empty($this->value)) {
            $attributes['data-has-value'] = 'true';
        }

        if ($this->minTime) {
            $attributes['data-min-time'] = $this->minTime;
        }

        if ($this->maxTime) {
            $attributes['data-max-time'] = $this->maxTime;
        }

        if ($this->name) {
            $attributes['data-name'] = $this->name;
        }

        return $attributes;
    }

    /**
     * Render the component.
     */
    public function render()
    {
        return view('keys::components.timepicker', [
            'dataAttributes' => $this->getDataAttributes(),
            'hourOptions' => $this->getHourOptions(),
            'minuteOptions' => $this->getMinuteOptions(),
            'secondOptions' => $this->getSecondOptions(),
            'periodOptions' => $this->getPeriodOptions(),
            'timePresets' => $this->getTimePresets(),
        ]);
    }
}
