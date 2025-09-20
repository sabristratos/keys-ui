<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Range extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public mixed $value = null,
        public mixed $minValue = null,
        public mixed $maxValue = null,
        public int|float $min = 0,
        public int|float $max = 100,
        public int|float $step = 1,
        public bool $dual = false,
        public array $ticks = [],
        public bool $showValues = false,
        public bool $showTicks = false,
        public string $size = 'md',
        public bool $disabled = false,
        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $hasError = false
    ) {
        $this->id = $this->id ?? $this->name;

        // Handle dual range values
        if ($this->dual) {
            if (is_array($this->value)) {
                $this->minValue = $this->value[0] ?? $this->min;
                $this->maxValue = $this->value[1] ?? $this->max;
            } else {
                $this->minValue = $this->value ?? $this->min;
                $this->maxValue = $this->max;
            }
        } else {
            $this->value = $this->value ?? $this->min;
        }

        // Auto-enable showTicks if ticks are provided
        if (!empty($this->ticks)) {
            $this->showTicks = true;
        }

        // Validate min/max
        if ($this->min >= $this->max) {
            $this->max = $this->min + 1;
        }

        // Ensure step is positive
        if ($this->step <= 0) {
            $this->step = 1;
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

    public function trackClasses(): string
    {
        $base = 'relative h-2 rounded-full transition-colors duration-200';
        $state = $this->disabled
            ? 'bg-neutral-200 dark:bg-neutral-700'
            : 'bg-neutral-200 dark:bg-neutral-700';

        return trim($base . ' ' . $state);
    }

    public function handleClasses(): string
    {
        $base = 'absolute w-5 h-5 rounded-full border-2 transition-all duration-200 transform -translate-y-1/2 cursor-pointer';

        if ($this->disabled) {
            $state = 'bg-neutral-100 border-neutral-300 cursor-not-allowed';
        } elseif ($this->hasError()) {
            $state = 'bg-white border-danger shadow-sm hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-danger focus:ring-offset-2';
        } else {
            $state = 'bg-white border-brand shadow-sm hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-brand focus:ring-offset-2';
        }

        return trim($base . ' ' . $state);
    }

    public function fillClasses(): string
    {
        $base = 'absolute h-full rounded-full transition-all duration-200';
        $state = $this->hasError()
            ? 'bg-danger'
            : 'bg-brand';

        return trim($base . ' ' . $state);
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'h-1',
            'md' => 'h-2',
            'lg' => 'h-3',
            default => 'h-2'
        };
    }

    public function containerClasses(): string
    {
        $base = 'relative';
        $spacing = match ($this->size) {
            'sm' => 'px-2 py-3',
            'md' => 'px-3 py-4',
            'lg' => 'px-4 py-5',
            default => 'px-3 py-4'
        };

        return trim($base . ' ' . $spacing);
    }

    public function getComputedValue(): mixed
    {
        if ($this->dual) {
            return [$this->minValue, $this->maxValue];
        }

        return $this->value;
    }

    public function getComputedPercentage(): float|array
    {
        $range = $this->max - $this->min;

        if ($this->dual) {
            $minPercent = (($this->minValue - $this->min) / $range) * 100;
            $maxPercent = (($this->maxValue - $this->min) / $range) * 100;
            return [$minPercent, $maxPercent];
        }

        return (($this->value - $this->min) / $range) * 100;
    }

    public function getComputedTicks(): array
    {
        if (empty($this->ticks)) {
            return [];
        }

        $computedTicks = [];
        $range = $this->max - $this->min;

        foreach ($this->ticks as $tick) {
            if (is_array($tick)) {
                $value = $tick['value'] ?? 0;
                $label = $tick['label'] ?? (string) $value;
            } else {
                $value = $tick;
                $label = (string) $tick;
            }

            if ($value >= $this->min && $value <= $this->max) {
                $percentage = (($value - $this->min) / $range) * 100;
                $computedTicks[] = [
                    'value' => $value,
                    'label' => $label,
                    'percentage' => $percentage,
                ];
            }
        }

        return $computedTicks;
    }

    public function getComputedTrackClasses(): string
    {
        return $this->trackClasses();
    }

    public function getComputedHandleClasses(): string
    {
        return $this->handleClasses();
    }

    public function getComputedFillClasses(): string
    {
        return $this->fillClasses();
    }

    public function getComputedContainerClasses(): string
    {
        return $this->containerClasses();
    }

    public function getUniqueId(): string
    {
        return $this->id ?? 'range-' . uniqid();
    }

    public function render()
    {
        return view('keys::components.range', [
            'computedValue' => $this->getComputedValue(),
            'computedPercentage' => $this->getComputedPercentage(),
            'computedTicks' => $this->getComputedTicks(),
            'computedTrackClasses' => $this->getComputedTrackClasses(),
            'computedHandleClasses' => $this->getComputedHandleClasses(),
            'computedFillClasses' => $this->getComputedFillClasses(),
            'computedContainerClasses' => $this->getComputedContainerClasses(),
            'uniqueId' => $this->getUniqueId(),
        ]);
    }
}