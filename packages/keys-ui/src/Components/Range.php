<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;

class Range extends Component
{
    use HandlesValidationErrors;

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
        public ?string $icon = null,  
        public ?string $hint = null,  
        public bool $hasError = false
    ) {
        $this->id = $this->id ?? $this->name;

        
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

        
        if (! empty($this->ticks)) {
            $this->showTicks = true;
        }

        
        if ($this->min >= $this->max) {
            $this->max = $this->min + 1;
        }

        
        if ($this->step <= 0) {
            $this->step = 1;
        }

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

    public function getUniqueId(): string
    {
        return $this->id ?? 'range-'.uniqid();
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-range' => 'true',
            'data-size' => $this->size,
            'data-min' => $this->min,
            'data-max' => $this->max,
            'data-step' => $this->step,
            'data-value' => $this->dual ? json_encode([$this->minValue, $this->maxValue]) : $this->value,
        ];

        
        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->hasError()) {
            $attributes['data-invalid'] = 'true';
        }

        
        if ($this->showValues) {
            $attributes['data-show-values'] = 'true';
        }

        if (! empty($this->ticks)) {
            $attributes['data-show-ticks'] = 'true';
            $attributes['data-ticks-count'] = count($this->ticks);
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.range', [
            'computedValue' => $this->getComputedValue(),
            'computedPercentage' => $this->getComputedPercentage(),
            'computedTicks' => $this->getComputedTicks(),
            'uniqueId' => $this->getUniqueId(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
