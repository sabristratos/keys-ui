<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Progress extends Component
{
    public function __construct(
        public int|float $value = 0,
        public int|float $max = 100,
        public ?string $label = null,
        public bool $showValue = true,
        public bool $showPercentage = true,
        public string $size = 'md',
        public string $color = 'brand',
        public string $variant = 'default',
        public bool $animated = false,
        public bool $striped = false,
        public ?string $status = null
    ) {
        $this->value = max(0, min($this->value, $this->max));
    }

    public function getPercentage(): float
    {
        if ($this->max === 0) {
            return 0;
        }
        return round(($this->value / $this->max) * 100, 1);
    }

    public function baseClasses(): string
    {
        return 'progress-wrapper';
    }

    public function containerClasses(): string
    {
        $base = 'progress-container relative overflow-hidden rounded-full';

        return $base . ' ' . $this->sizeClasses() . ' ' . $this->backgroundClasses();
    }

    public function barClasses(): string
    {
        $base = 'progress-bar h-full rounded-full transition-all duration-300 ease-out';

        $classes = [$base, $this->colorClasses()];

        if ($this->animated) {
            $classes[] = 'progress-animated';
        }

        if ($this->striped) {
            $classes[] = 'progress-striped';
        }

        return implode(' ', $classes);
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'h-1',
            'sm' => 'h-2',
            'md' => 'h-3',
            'lg' => 'h-4',
            'xl' => 'h-6',
            default => 'h-3'
        };
    }

    public function backgroundClasses(): string
    {
        return 'bg-border';
    }

    public function colorClasses(): string
    {
        return match ($this->color) {
            'brand' => 'bg-brand',
            'success' => 'bg-success',
            'warning' => 'bg-warning',
            'danger' => 'bg-danger',
            'info' => 'bg-info',
            'neutral' => 'bg-neutral',
            default => 'bg-brand'
        };
    }

    public function textClasses(): string
    {
        return match ($this->size) {
            'xs', 'sm' => 'text-xs',
            'md' => 'text-sm',
            'lg', 'xl' => 'text-base',
            default => 'text-sm'
        };
    }

    public function getDisplayValue(): string
    {
        if ($this->showPercentage) {
            return $this->getPercentage() . '%';
        }

        if ($this->showValue) {
            return $this->value . '/' . $this->max;
        }

        return '';
    }

    public function getAriaLabel(): string
    {
        $percentage = $this->getPercentage();
        $baseLabel = $this->label ?: 'Progress';

        return $baseLabel . ': ' . $percentage . '% complete';
    }

    public function isComplete(): bool
    {
        return $this->value >= $this->max;
    }

    public function getComputedData(): array
    {
        return [
            'percentage' => $this->getPercentage(),
            'display_value' => $this->getDisplayValue(),
            'aria_label' => $this->getAriaLabel(),
            'is_complete' => $this->isComplete(),
        ];
    }

    public function render()
    {
        return view('keys::components.progress', [
            'computedData' => $this->getComputedData(),
        ]);
    }
}