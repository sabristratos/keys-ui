<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Tooltip extends Component
{
    public function __construct(
        public ?string $target = null,
        public string $placement = 'top',
        public string $color = 'dark',
        public string $size = 'md',
        public bool $arrow = true,
        public string $trigger = 'hover',
        public int $delay = 100,
        public ?string $id = null,
        public bool $disabled = false
    ) {
        // Generate unique ID if not provided
        $this->id = $this->id ?? 'tooltip-' . uniqid();

        // Validate placement
        if (!in_array($this->placement, ['top', 'bottom', 'left', 'right'])) {
            $this->placement = 'top';
        }

        // Validate color
        if (!in_array($this->color, ['dark', 'light'])) {
            $this->color = 'dark';
        }

        // Validate size
        if (!in_array($this->size, ['sm', 'md', 'lg'])) {
            $this->size = 'md';
        }

        // Validate trigger
        if (!in_array($this->trigger, ['hover', 'click', 'focus'])) {
            $this->trigger = 'hover';
        }
    }

    public function getTooltipClasses(): string
    {
        $color = $this->getColorClasses();
        return $color;
    }

    protected function getSizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'px-2 py-1 text-xs',
            'md' => 'px-3 py-2 text-sm',
            'lg' => 'px-4 py-3 text-base',
            default => 'px-3 py-2 text-sm'
        };
    }

    protected function getColorClasses(): string
    {
        return match ($this->color) {
            'dark' => 'bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600',
            'light' => 'bg-surface text-foreground border border-border shadow-lg',
            default => 'bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600'
        };
    }

    public function getArrowClasses(): string
    {
        if (!$this->arrow) {
            return '';
        }

        return '';
    }

    protected function getArrowColorClasses(): string
    {
        return match ($this->color) {
            'dark' => 'bg-neutral-900 border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600',
            'light' => 'bg-surface border border-border',
            default => 'bg-neutral-900 border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600'
        };
    }

    protected function getArrowPositionClasses(): string
    {
        // Let CSS handle positioning via data-placement attribute
        return '';
    }

    public function getTooltipAttributes(): array
    {
        $attributes = [
            'role' => 'tooltip',
            'data-tooltip' => 'true',
            'data-placement' => $this->placement,
            'data-trigger' => $this->trigger,
            'data-delay' => $this->delay,
            'data-color' => $this->color,
            'data-size' => $this->size,
            'id' => $this->id
        ];

        if ($this->target) {
            $attributes['data-target'] = $this->target;
        }

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        return $attributes;
    }

    public function getTriggerAttributes(): array
    {
        $attributes = [];

        if ($this->target) {
            $attributes['data-tooltip-target'] = $this->id;
            $attributes['data-tooltip-placement'] = $this->placement;
            $attributes['data-tooltip-trigger'] = $this->trigger;
        }

        return $attributes;
    }

    public function getComputedTooltipClasses(): string
    {
        return $this->getTooltipClasses();
    }

    public function getComputedArrowClasses(): string
    {
        return $this->getArrowClasses();
    }

    public function render()
    {
        return view('keys::components.tooltip', [
            'computedTooltipClasses' => $this->getComputedTooltipClasses(),
            'computedArrowClasses' => $this->getComputedArrowClasses(),
            'tooltipAttributes' => $this->getTooltipAttributes(),
            'triggerAttributes' => $this->getTriggerAttributes(),
        ]);
    }
}