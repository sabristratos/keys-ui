<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class TimePicker extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = null,
        public ?string $placeholder = null,
        public string $format = '24', // '12' or '24'
        public int $step = 1, // Minute step intervals (1, 5, 15, 30)
        public ?string $minTime = null,
        public ?string $maxTime = null,
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
        public bool $showSeconds = false,
        public string $formatMode = 'flexible'
    ) {
        $this->id = $this->id ?? $this->name;

        // Validate formatMode
        if (!in_array($this->formatMode, ['12', '24', 'flexible'])) {
            $this->formatMode = 'flexible';
        }

        // Set format based on formatMode if format mode is fixed
        if ($this->formatMode === '12') {
            $this->format = '12';
        } elseif ($this->formatMode === '24') {
            $this->format = '24';
        }

        // Validate format
        if (!in_array($this->format, ['12', '24'])) {
            $this->format = '24';
        }

        // Validate step
        if (!in_array($this->step, [1, 5, 15, 30])) {
            $this->step = 1;
        }

        // Format time value if provided
        if ($this->value) {
            $this->value = $this->formatTimeValue($this->value);
        }

        // Set default placeholder based on format
        if (!$this->placeholder) {
            $this->placeholder = $this->format === '12'
                ? ($this->showSeconds ? 'h:mm:ss AM' : 'h:mm AM')
                : ($this->showSeconds ? 'HH:mm:ss' : 'HH:mm');
        }

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

    public function inputClasses(): string
    {
        $base = 'block w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';
        $size = $this->sizeClasses();
        $state = $this->stateClasses();
        $padding = $this->paddingClasses();

        return trim($base . ' ' . $size . ' ' . $state . ' ' . $padding);
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'py-1.5 text-sm',
            'md' => 'py-2 text-sm',
            'lg' => 'py-2.5 text-base',
            default => 'py-2 text-sm'
        };
    }

    public function paddingClasses(): string
    {
        $leftPadding = match ($this->size) {
            'sm' => 'pl-3',
            'md' => 'pl-3',
            'lg' => 'pl-4',
            default => 'pl-3'
        };

        $rightPadding = $this->clearable ? match ($this->size) {
            'sm' => 'pr-8',
            'md' => 'pr-10',
            'lg' => 'pr-12',
            default => 'pr-10'
        } : match ($this->size) {
            'sm' => 'pr-8',
            'md' => 'pr-10',
            'lg' => 'pr-12',
            default => 'pr-10'
        };

        return trim($leftPadding . ' ' . $rightPadding);
    }

    public function stateClasses(): string
    {
        if ($this->disabled) {
            return 'bg-surface border-border text-muted cursor-not-allowed opacity-50';
        }

        if ($this->hasError()) {
            return 'bg-input border-danger text-foreground focus:border-danger focus:ring-danger';
        }

        return 'bg-input border-border text-foreground focus:border-brand focus:ring-brand hover:border-neutral-300 dark:hover:border-neutral-600';
    }

    public function dropdownClasses(): string
    {
        return 'absolute z-50 mt-1 w-full rounded-md bg-surface border border-border shadow-lg';
    }

    public function iconSize(): string
    {
        return match ($this->size) {
            'sm' => 'xs',
            'md' => 'sm',
            'lg' => 'md',
            default => 'sm'
        };
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

    public function formatTimeValue(?string $time): ?string
    {
        if (!$time) {
            return null;
        }

        try {
            $parsedTime = \DateTime::createFromFormat('H:i:s', $time);
            if (!$parsedTime) {
                $parsedTime = \DateTime::createFromFormat('H:i', $time);
            }
            if (!$parsedTime) {
                $parsedTime = \DateTime::createFromFormat('g:i A', $time);
            }
            if (!$parsedTime) {
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
            // Return original value if parsing fails
        }

        return $time;
    }

    public function getComputedInputClasses(): string
    {
        return $this->inputClasses();
    }

    public function getComputedDropdownClasses(): string
    {
        return $this->dropdownClasses();
    }

    public function getComputedIconSize(): string
    {
        return $this->iconSize();
    }

    public function getComputedHourOptions(): array
    {
        return $this->getHourOptions();
    }

    public function getComputedMinuteOptions(): array
    {
        return $this->getMinuteOptions();
    }

    public function getComputedSecondOptions(): array
    {
        return $this->getSecondOptions();
    }

    public function getComputedPeriodOptions(): array
    {
        return $this->getPeriodOptions();
    }

    public function getUniqueId(): string
    {
        return $this->id ?? 'timepicker-' . uniqid();
    }

    public function render()
    {
        return view('keys::components.timepicker', [
            'computedInputClasses' => $this->getComputedInputClasses(),
            'computedDropdownClasses' => $this->getComputedDropdownClasses(),
            'computedIconSize' => $this->getComputedIconSize(),
            'computedHourOptions' => $this->getComputedHourOptions(),
            'computedMinuteOptions' => $this->getComputedMinuteOptions(),
            'computedSecondOptions' => $this->getComputedSecondOptions(),
            'computedPeriodOptions' => $this->getComputedPeriodOptions(),
            'uniqueId' => $this->getUniqueId(),
        ]);
    }
}